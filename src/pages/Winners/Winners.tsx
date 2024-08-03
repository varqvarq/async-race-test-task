import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ICar, QueryParams } from '../../types';

import CarIcon from '../../components/CarIcon/CarIcon';
import Pagination from '../../components/Pagination/Pagination';
import { DEFAULT_PAGE, WINNERS_PER_PAGE } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCarById } from '../../redux/garage/garageSlice';
import {
	fetchAllWinners,
	selectWinnersData,
} from '../../redux/winners/winnerSlice';

import style from './Winners.module.scss';

const Winners: React.FC = () => {
	const { winners } = useAppSelector(selectWinnersData);
	const dispatch = useAppDispatch();

	const { data, totalCount } = winners;

	const [winnerDetails, setWinnerDetails] = useState<Record<number, ICar>>({});
	const [sort, setSort] = useState<QueryParams['sort']>();
	const [order, setOrder] = useState<QueryParams['order']>();

	const [searchParams, setSearchParams] = useSearchParams({
		page: DEFAULT_PAGE.toString(),
	});

	const query = searchParams.get('page');
	const page =
		query && !Number.isNaN(+query) && +query > 0 ? +query : DEFAULT_PAGE;

	useEffect(() => {
		const fetchData = async () => {
			await dispatch(
				fetchAllWinners({
					page,
					sort,
					order,
					limit: WINNERS_PER_PAGE,
				})
			).unwrap();

			const allPages = Math.ceil(totalCount / WINNERS_PER_PAGE);

			if (page > allPages && allPages > 0) {
				setSearchParams({ page: allPages.toString() });
			}
		};

		if (!totalCount) {
			fetchData();
		}
	}, [dispatch, sort, order, totalCount, page, setSearchParams]);

	useEffect(() => {
		const fetchWinnerDetails = async () => {
			const winnersWithoutDetails = data.filter(
				(winner) => !winnerDetails[winner.id]
			);

			if (winnersWithoutDetails.length === 0) return;

			const ids = winnersWithoutDetails.map((winner) => winner.id);

			const detailsPromises = ids.map((id) =>
				dispatch(getCarById(id)).unwrap()
			);
			const details = await Promise.all(detailsPromises);

			const newCarDetails = details.reduce(
				(acc, car) => {
					acc[car.id!] = car;
					return acc;
				},
				{} as Record<number, ICar>
			);

			setWinnerDetails((prev) => ({
				...prev,
				...newCarDetails,
			}));
		};

		if (data.length > 0) {
			fetchWinnerDetails();
		}
	}, [dispatch, data, winnerDetails]);

	const handleSort = (field: QueryParams['sort']) => {
		if (data.length) {
			setSort(field);
			setOrder((prevOrder) => (prevOrder === 'ASC' ? 'DESC' : 'ASC'));
		}
	};

	const getSortArrow = (column: QueryParams['sort']) => {
		if (sort === column) {
			return order === 'ASC' ? (
				<span className={style.upArrow}>▲</span>
			) : (
				<span className={style.downArrow}>▼</span>
			);
		}
		return '';
	};

	return (
		<div className={style.winnersContainer}>
			<div>
				<h2>Winners</h2>
				<span>Click on headers to sort</span>
			</div>

			<table className={style.winnerTable}>
				<thead>
					<tr>
						<th onClick={() => handleSort('id')}>
							Number {getSortArrow('id')}
						</th>
						<th>Image</th>
						<th>Name</th>
						<th onClick={() => handleSort('wins')}>
							Wins <span className={style.arrow}>{getSortArrow('wins')}</span>
						</th>
						<th onClick={() => handleSort('time')}>
							Best Time (sec)
							<span className={style.arrow}>{getSortArrow('time')}</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{data.length ? (
						data.map((winner) => (
							<tr key={winner.id}>
								<td>{winner.id}</td>
								<td className={style.car}>
									<CarIcon color={winnerDetails[winner.id]?.color || 'grey'} />
								</td>
								<td>{winnerDetails[winner.id]?.name || 'Loading...'}</td>
								<td>{winner.wins}</td>
								<td>{winner.time}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={5}>
								<h2>No winners yet...</h2>
							</td>
						</tr>
					)}
				</tbody>
			</table>

			<div className={style.pagination}>
				<Pagination
					totalCount={totalCount}
					elementsPerPage={WINNERS_PER_PAGE}
				/>
			</div>
		</div>
	);
};

export default Winners;
