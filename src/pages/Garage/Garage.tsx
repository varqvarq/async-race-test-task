import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IWinner, RaceWinner } from '../../types';

import { drive, toggleEngine } from '../../api';
import CarForm from '../../components/CarForm/CarForm';
import CarIcon from '../../components/CarIcon/CarIcon';
import Pagination from '../../components/Pagination/Pagination';
import WinnerBanner from '../../components/WinnerBanner/WinnerBanner';
import Button from '../../components/common/Button/Button';
import { ActionStatus, CARS_PER_PAGE, DEFAULT_PAGE } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
	createCar,
	deleteCar,
	fetchAllCars,
	selectGarageData,
} from '../../redux/garage/garageSlice';
import {
	createWinner,
	deleteWinner,
	getWinnerById,
	updateWinner,
} from '../../redux/winners/winnerSlice';
import generateRandomCars from '../../utils/generateCars';
import getCarPositon from '../../utils/getCarPosition';

import style from './Garage.module.scss';

const Garage = () => {
	const dispatch = useAppDispatch();
	const { garage, status } = useAppSelector(selectGarageData);
	const { data: cars, totalCount } = garage;

	const [searchParams, setSearchParams] = useSearchParams({
		page: DEFAULT_PAGE.toString(),
	});
	const [winner, setWinner] = useState<RaceWinner | null>(null);
	const [raceInProgress, setRaceInProgress] = useState<boolean>(false);
	const [singleRaceInProgress, setSingleRaceInProgress] = useState<number[]>(
		[]
	);

	const [carId, setCarId] = useState<number | undefined>();
	const [generation, setGeneration] = useState(false);

	const winCheckRef = useRef(false);
	const raceStartedRef = useRef(false);
	const singleRaceStartedRef = useRef(false);

	const carRefs = useRef<Record<number, HTMLDivElement>>({});

	const setCarRef = (id: number) => (el: HTMLDivElement) => {
		carRefs.current[id] = el;
	};

	const query = searchParams.get('page');

	const page =
		query && !Number.isNaN(+query) && +query > 0 ? +query : DEFAULT_PAGE;

	useEffect(() => {
		const fetchData = async () => {
			let currentPage = page;

			const response = await dispatch(
				fetchAllCars({ page: currentPage })
			).unwrap();

			const allPages = Math.ceil(response.totalCount / CARS_PER_PAGE);

			if (currentPage > allPages) {
				currentPage = allPages;
			}

			setSearchParams({ page: currentPage.toString() });
		};
		fetchData();

		setRaceInProgress(false);
	}, [dispatch, page, setSearchParams]);

	const handleEngine =
		(engineStatus: ActionStatus.STARTED | ActionStatus.STOPPED) =>
		async (id: number) =>
			toggleEngine(id, engineStatus);

	const startEngine = handleEngine(ActionStatus.STARTED);
	const stopEngine = handleEngine(ActionStatus.STOPPED);

	const handleWinner = async (id: number, time: number) => {
		const existingWinner = await dispatch(getWinnerById(id));

		if (existingWinner.payload && typeof existingWinner.payload !== 'string') {
			const newWins = existingWinner.payload.wins + 1;
			const newTime = Math.min(existingWinner.payload.time, time);

			const updatedWinner: IWinner = {
				wins: newWins,
				time: newTime,
				id,
			};

			await dispatch(updateWinner(updatedWinner));
			return;
		}
		const newWinner: IWinner = {
			wins: 1,
			time,
			id,
		};
		await dispatch(createWinner(newWinner));
	};

	const handleDrive = async (id: number) => {
		const currentCar = carRefs.current[id];

		if (!currentCar.parentElement) {
			return;
		}

		const response = await startEngine(id);
		const time = +(
			response.data.distance /
			response.data.velocity /
			1000
		).toFixed(2);

		const raceLenght = currentCar.parentElement.clientWidth;
		const carLenght = currentCar.clientWidth;

		const finish = Math.round(raceLenght - carLenght);

		try {
			if (raceStartedRef.current || singleRaceStartedRef.current) {
				currentCar.style.transform = `translateX(${finish}px)`;
				currentCar.style.transition = `transform ${time}s ease-in-out`;
			}

			await drive(id);

			const carPosition = Math.round(getCarPositon(currentCar));

			if (
				!winCheckRef.current &&
				carPosition === finish &&
				raceStartedRef.current &&
				!singleRaceStartedRef.current
			) {
				winCheckRef.current = true;
				setWinner({ id, time });
				await handleWinner(id, time);
			}
		} catch (e) {
			const computedStyles = getComputedStyle(currentCar);
			const carPosition = getCarPositon(currentCar);
			if (e instanceof Error && e.message === 'engine break') {
				if (
					!winCheckRef.current &&
					carPosition === finish &&
					raceStartedRef.current &&
					!singleRaceStartedRef.current
				) {
					winCheckRef.current = true;
					setWinner({ id, time });
					await handleWinner(id, time);
				}

				currentCar.style.transform = computedStyles.transform;
				currentCar.style.transition = 'none';
			} else {
				currentCar.style.transform = `translateX(0)`;
				currentCar.style.transition = `transform 0s`;
			}
		}
	};

	const toggleRace = async (
		id: number,
		raceStatus: ActionStatus.STARTED | ActionStatus.STOPPED
	) => {
		const currentCar = carRefs.current[id];

		currentCar.style.transform = `translateX(0)`;
		currentCar.style.transition = `transform 0.3s ease-in-out`;

		if (
			raceStatus === ActionStatus.STARTED &&
			(raceStartedRef.current || singleRaceStartedRef.current)
		) {
			await handleDrive(id);
		} else {
			await stopEngine(id);
		}
	};

	const handleRace =
		(raceStatus: ActionStatus.STARTED | ActionStatus.STOPPED) => async () => {
			setRaceInProgress(raceStatus === ActionStatus.STARTED);
			raceStartedRef.current = raceStatus === ActionStatus.STARTED;
			setWinner(null);
			winCheckRef.current = false;

			const promises = cars.map((car) => toggleRace(car.id!, raceStatus));
			await Promise.all(promises);
		};

	const handleSingleRace =
		(raceStatus: ActionStatus.STARTED | ActionStatus.STOPPED) =>
		async (id: number) => {
			singleRaceStartedRef.current = raceStatus === ActionStatus.STARTED;

			if (raceStatus === ActionStatus.STARTED) {
				setSingleRaceInProgress((prev) => [...prev, id]);
			} else {
				setSingleRaceInProgress((prev) =>
					prev.filter((raceCarId) => raceCarId !== id)
				);
			}

			await toggleRace(id, raceStatus);
		};

	const startRace = handleRace(ActionStatus.STARTED);
	const recetRace = handleRace(ActionStatus.STOPPED);

	const startSingleRace = handleSingleRace(ActionStatus.STARTED);
	const stopSingleRace = handleSingleRace(ActionStatus.STOPPED);

	const handleCarGeneration = async () => {
		setGeneration(true);
		const randomCars = generateRandomCars();
		const promises = randomCars.map((car) => dispatch(createCar(car)));

		await Promise.all(promises).then(() => {
			setGeneration(false);
			dispatch(fetchAllCars({ page }));
		});
	};

	const handleCarDelete = async (id: number) => {
		await dispatch(deleteCar(id));
		await dispatch(deleteWinner(id));

		const updatedTotalCount = totalCount - 1;
		const allPages = Math.ceil(updatedTotalCount / CARS_PER_PAGE);
		let currentPage = page;

		if (currentPage > allPages && allPages > 0) {
			currentPage = allPages;
		}

		setSearchParams({ page: currentPage.toString() });

		await dispatch(fetchAllCars({ page: currentPage }));
	};

	return (
		<div className={style.mainWrapper}>
			<h2>Garage</h2>
			<div className={style.topSection}>
				<CarForm
					carId={carId}
					setCarId={setCarId}
					raceInProgress={raceInProgress}
				/>

				<div className={style.raceControl}>
					<Button
						text='start Race'
						className={style.button}
						onClick={startRace}
						disabled={
							raceInProgress ||
							!cars.length ||
							!!singleRaceInProgress.length ||
							generation
						}
					/>
					<Button
						text='reset race'
						className={style.button}
						onClick={recetRace}
						disabled={!raceInProgress || !cars.length || generation}
					/>
					<Button
						text='+100 cars'
						onClick={handleCarGeneration}
						disabled={
							generation || raceInProgress || !!singleRaceInProgress.length
						}
						className={style.button}
					/>
				</div>
			</div>

			<ul className={style.garageContainer}>
				{cars.length > 0 ? (
					cars.map((car) => (
						<li key={car.id} className={style.carContainer}>
							<div className={style.carControl}>
								<Button
									text='start'
									className={style.button}
									disabled={
										raceInProgress ||
										singleRaceInProgress.includes(car.id!) ||
										generation
									}
									onClick={() => startSingleRace(car.id!)}
								/>
								<Button
									text='stop'
									className={style.button}
									disabled={
										raceInProgress ||
										!singleRaceInProgress.includes(car.id!) ||
										generation
									}
									onClick={() => stopSingleRace(car.id!)}
								/>
								<Button
									text='delete'
									onClick={() => {
										handleCarDelete(car.id!);
									}}
									className={style.button}
									disabled={
										raceInProgress ||
										singleRaceInProgress.includes(car.id!) ||
										generation
									}
								/>
								<Button
									text='edit'
									className={style.button}
									disabled={
										raceInProgress ||
										singleRaceInProgress.includes(car.id!) ||
										generation
									}
									onClick={() => setCarId(car.id)}
								/>
							</div>

							<div className={style.raceTrackContainer}>
								<div className={style.raceTrack}>
									<h3 style={{ position: 'absolute', right: '100px' }}>
										{car.id}
									</h3>
									{status !== 'loading' && (
										<p className={style.carName}>{car.name}</p>
									)}
									<div
										className={style.car}
										style={{ color: `${car.color}` }}
										ref={setCarRef(car.id!)}
									>
										<CarIcon
											color={`${status === 'loading' ? 'gray' : car.color}`}
										/>
									</div>
								</div>
							</div>
						</li>
					))
				) : (
					<h2>No cars in the garage...</h2>
				)}

				<div className={style.pagination}>
					<Pagination totalCount={totalCount} elementsPerPage={CARS_PER_PAGE} />
				</div>
			</ul>

			{winner !== null && raceInProgress && (
				<WinnerBanner winner={winner} setWinner={setWinner} />
			)}
		</div>
	);
};

export default Garage;
