import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ICar, QueryParams } from '../../types';

import CarIcon from '../../components/CarIcon/CarIcon';
import Pagination from '../../components/Pagination/Pagination';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCarById } from '../../redux/garage/garageSlice';
import {
	fetchAllWinners,
	selectWinnersData,
} from '../../redux/winners/winnerSlice';

import style from './Winners.module.scss';

const Winners: React.FC = () => {
	const { winners, totalCount } = useAppSelector(selectWinnersData);
	const dispatch = useAppDispatch();
	const [carDetails, setCarDetails] = useState<Record<number, ICar>>({});
	const [sort, setSort] = useState<QueryParams['sort']>();
	const [order, setOrder] = useState<QueryParams['order']>();

	const [searchParams, setSearchParams] = useSearchParams({ page: '1' });
	const query = searchParams.get('page');

	const page = query && !Number.isNaN(+query) && +query > 0 ? +query : 1;

	useEffect(() => {
		const fetch = async () => {
			let currentPage = page;

			await dispatch(
				fetchAllWinners({ page: currentPage, sort, order, limit: 10 })
			).unwrap();

			const allPages = Math.ceil(totalCount / 7);

			if (currentPage > allPages && allPages > 0) {
				currentPage = allPages;
			}

			setSearchParams({ page: currentPage.toString() });
		};

		fetch();
	}, [dispatch, order, page, setSearchParams, sort, totalCount]);

	useEffect(() => {
		const fetchWinnerDetails = async () => {
			winners.map(async (winner) => {
				if (!carDetails[winner.id]) {
					const result = await dispatch(getCarById(winner.id)).unwrap();

					setCarDetails((prev) => ({
						...prev,
						[winner.id]: result,
					}));
				}
			});
		};

		if (winners.length > 0) {
			fetchWinnerDetails();
		}
	}, [dispatch, winners, carDetails]);

	const handleSort = (field: QueryParams['sort']) => {
		if (winners.length) {
			setSort(field);
			if (order === 'ASC') {
				setOrder('DESC');
			} else {
				setOrder('ASC');
			}
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
					{winners.length ? (
						winners.map((winner) => (
							<tr key={winner.id}>
								<td>{winner.id}</td>
								<td className={style.car}>
									<CarIcon color={carDetails[winner.id]?.color || 'grey'} />
								</td>
								<td>{carDetails[winner.id]?.name || 'Loading...'}</td>
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
				<Pagination totalCount={totalCount} />
			</div>
		</div>
	);
};

export default Winners;
