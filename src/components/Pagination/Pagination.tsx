import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Button from '../common/Button/Button';

import style from './Pagination.module.scss';

interface PaginationProps {
	totalCount: number;
	elementsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
	totalCount,
	elementsPerPage,
}) => {
	const [params] = useSearchParams({ page: '1' });
	const [currentPage, setCurrentPage] = useState(1);
	const navigate = useNavigate();

	const pageParams = params.get('page');
	const page = pageParams ? +pageParams : 1;

	const allPages = Math.ceil(totalCount / elementsPerPage);

	useEffect(() => {
		if (page) {
			setCurrentPage(page);
		}
	}, [page]);

	const onPrevClick = () => {
		if (currentPage > 1) {
			navigate(`?page=${currentPage - 1}`);
		}
	};

	const onNextClick = () => {
		if (currentPage < allPages) {
			navigate(`?page=${currentPage + 1}`);
		}
	};

	const onPageChange = (pageNumber: number) => {
		navigate(`?page=${pageNumber}`);
	};

	return (
		<div className={style.list}>
			<Button
				text='&larr;'
				onClick={() => onPrevClick()}
				className={style.link}
				disabled={currentPage <= 1}
			/>
			<Button
				text='1'
				className={`${style.link} ${currentPage === 1 ? style.active : ''}`}
				onClick={() => {
					onPageChange(1);
				}}
			/>

			{currentPage > 1 && currentPage < allPages && (
				<Button
					text={currentPage}
					className={`${style.link} ${style.active}`}
					onClick={() => {
						onPageChange(currentPage);
					}}
				/>
			)}

			{allPages > 1 && (
				<Button
					text={allPages}
					className={`${style.link} ${currentPage === allPages ? style.active : ''}`}
					onClick={() => {
						onPageChange(allPages);
					}}
				/>
			)}
			<Button
				text='&rarr;'
				className={style.link}
				onClick={() => onNextClick()}
				disabled={currentPage >= allPages}
			/>
		</div>
	);
};

export default Pagination;
