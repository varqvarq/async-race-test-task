import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IWinner } from '../../types';

import { drive, toggleEngine } from '../../api';
import CarForm from '../../components/CarForm/CarForm';
import CarIcon from '../../components/CarIcon/CarIcon';
import Pagination from '../../components/Pagination/Pagination';
import Button from '../../components/common/Button/Button';
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

import style from './Garage.module.scss';

interface RaceWinner {
	id: number;
	time: number;
}

const Garage = () => {
	const dispatch = useAppDispatch();
	const { cars, totalCount, status } = useAppSelector(selectGarageData);

	const [searchParams, setSearchParams] = useSearchParams({ page: '1' });
	const [winner, setWinner] = useState<RaceWinner | null>(null);
	const [raceInProgress, setRaceInProgress] = useState<boolean>(false);
	const [singleRaceInProgress, setOneRaceInProgress] = useState<number[]>([]);
	const [carId, setCarId] = useState<number | undefined>();
	const [generation, setGeneration] = useState(false);

	let winCheck = false;
	let raceStarted = false;
	let singleRaceStarted = false;

	const carRefs = useRef<Record<number, HTMLDivElement>>({});
	const garageRef = useRef<HTMLUListElement | null>(null);

	const setCarRef = (id: number) => (el: HTMLDivElement) => {
		carRefs.current[id] = el;
	};

	const query = searchParams.get('page');

	const page = query && !Number.isNaN(+query) && +query > 0 ? +query : 1;

	useEffect(() => {
		const fetch = async () => {
			let currentPage = page;

			await dispatch(fetchAllCars({ page: currentPage })).unwrap();

			const allPages = Math.ceil(totalCount / 7);

			if (currentPage > allPages && allPages > 0) {
				currentPage = allPages;
			}

			setSearchParams({ page: currentPage.toString() });
		};

		fetch();
	}, [dispatch, page, setSearchParams, totalCount]);

	const handleEngine =
		(engineStatus: 'started' | 'stopped') => async (id: number) =>
			toggleEngine(id, engineStatus);

	const startEngine = handleEngine('started');
	const stopEngine = handleEngine('stopped');

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

	const getCarPositon = (car: HTMLDivElement) => {
		const parentRect = car.parentElement!.getBoundingClientRect();
		const carRect = car.getBoundingClientRect();
		return carRect.left - parentRect.left - 1;
	};

	const handleDrive = async (id: number) => {
		const currentCar = carRefs.current[id];

		if (!currentCar.parentElement) {
			return;
		}

		const response = await startEngine(id);
		const time = +(response.distance / response.velocity / 1000).toFixed(2);

		const raceLenght = currentCar.parentElement.clientWidth;
		const carLenght = currentCar.clientWidth;

		const finish = raceLenght - carLenght;

		try {
			currentCar.style.transform = `translateX(${finish}px)`;
			currentCar.style.transition = `transform ${time}s ease-in-out`;

			await drive(id);

			const carPosition = getCarPositon(currentCar);

			if (
				!winCheck &&
				+carPosition.toFixed(0) === finish &&
				raceStarted &&
				!singleRaceStarted
			) {
				winCheck = true;
				setWinner({ id, time });

				await handleWinner(id, time);
			}
		} catch (e) {
			const computedStyles = getComputedStyle(currentCar);
			const carPosition = getCarPositon(currentCar);

			if (e instanceof Error && e.message === '500') {
				if (
					!winCheck &&
					+carPosition.toFixed(0) === finish &&
					!singleRaceStarted
				) {
					winCheck = true;
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

	const handleRace = async (id: number, raceStatus: 'started' | 'stopped') => {
		const currentCar = carRefs.current[id];

		currentCar.style.transform = `translateX(0)`;
		currentCar.style.transition = `transform 0.3s ease-in-out`;

		if ((raceStatus === 'started' && raceStarted) || singleRaceStarted) {
			await handleDrive(id);
			return;
		}

		currentCar.style.transform = `translateX(0)`;
		currentCar.style.transition = `transform 0.3s ease-in-out`;
		await stopEngine(id);
	};

	const startRace = async () => {
		setRaceInProgress(true);
		setWinner(null);
		raceStarted = true;

		const promises = cars.map((car) => handleRace(car.id!, 'started'));
		await Promise.all(promises);
	};

	const recetRace = async () => {
		setRaceInProgress(false);
		setWinner(null);
		raceStarted = false;

		const promises = cars.map((car) => handleRace(car.id!, 'stopped'));
		await Promise.all(promises);
	};

	const startSingleRace = async (id: number) => {
		singleRaceStarted = true;
		setOneRaceInProgress([...singleRaceInProgress, id]);
		await handleRace(id, 'started');
	};

	const stopSingleRace = async (id: number) => {
		singleRaceStarted = false;
		setOneRaceInProgress((prev) =>
			prev.filter((raceCarId) => raceCarId !== id)
		);

		await handleRace(id, 'stopped');
	};

	const handleCarGeneration = async () => {
		const randomCars = generateRandomCars();
		const promises = randomCars.map((car) => dispatch(createCar(car)));
		setGeneration(true);

		await Promise.all(promises).then(() => {
			setGeneration(false);
			dispatch(fetchAllCars({ page }));
		});
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
							raceInProgress || !cars.length || !!singleRaceInProgress.length
						}
					/>
					<Button
						text='reset race'
						className={style.button}
						onClick={recetRace}
						disabled={!raceInProgress || !cars.length}
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

			<ul className={style.garageContainer} ref={garageRef}>
				{cars.length > 0 ? (
					cars.map((car) => (
						<li key={car.id} className={style.carContainer}>
							<div className={style.carControl}>
								<Button
									text='start'
									className={style.button}
									disabled={
										raceInProgress || singleRaceInProgress.includes(car.id!)
									}
									onClick={() => startSingleRace(car.id!)}
								/>
								<Button
									text='stop'
									className={style.button}
									disabled={
										raceInProgress || !singleRaceInProgress.includes(car.id!)
									}
									onClick={() => stopSingleRace(car.id!)}
								/>
								<Button
									text='delete'
									onClick={async () => {
										await dispatch(deleteCar(car.id!));
										await dispatch(deleteWinner(car.id!));
									}}
									className={style.button}
									disabled={
										raceInProgress || singleRaceInProgress.includes(car.id!)
									}
								/>
								<Button
									text='edit'
									className={style.button}
									disabled={
										raceInProgress || singleRaceInProgress.includes(car.id!)
									}
									onClick={() => setCarId(car.id)}
								/>
							</div>

							<div className={style.raceTrackContainer}>
								<div className={style.raceTrack}>
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

				{totalCount > 7 && (
					<div className={style.pagination}>
						<Pagination totalCount={totalCount} />
					</div>
				)}
			</ul>

			{winner !== null && raceInProgress && (
				<div className={style.winner}>
					<p>
						Winner:
						<br /> <b>{cars.find((car) => car.id === winner.id)?.name}</b>
					</p>
					<p>
						Time: <br />
						<b>{winner.time.toFixed(2)}</b> seconds
					</p>
					<Button
						text='x'
						className={style.winnerCloseButton}
						onClick={() => setWinner(null)}
					/>
				</div>
			)}
		</div>
	);
};

export default Garage;
