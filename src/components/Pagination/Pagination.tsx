import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_PAGE } from '../../constants';
import { usePageQuery } from '../../hooks';
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
	const navigate = useNavigate();

	const [page, setPage] = usePageQuery();

	const allPages = Math.ceil(totalCount / elementsPerPage);

	const prevPage = Math.max(2, Math.min(page - 1, allPages - 3));
	const middlePage = Math.max(3, Math.min(prevPage + 1, allPages - 2));
	const nextPage = Math.max(4, Math.min(middlePage + 1, allPages - 1));

	useEffect(() => {
		if (page > allPages && allPages > 0) {
			setPage(allPages);
		}
	}, [allPages, page, setPage]);

	const navigateToPage = (pageNumber: number) => {
		if (pageNumber < DEFAULT_PAGE || pageNumber > allPages) return;
		navigate(`?page=${pageNumber}`);
	};

	const onPrevClick = () => {
		navigateToPage(page - 1);
	};

	const onNextClick = () => {
		navigateToPage(page + 1);
	};

	return (
		<div className={style.list}>
			<Button
				text='&larr;'
				onClick={onPrevClick}
				className={style.link}
				disabled={page <= DEFAULT_PAGE}
			/>
			<Button
				text={DEFAULT_PAGE.toString()}
				className={`${style.link} ${page === DEFAULT_PAGE ? style.active : ''}`}
				onClick={() => navigateToPage(DEFAULT_PAGE)}
			/>

			{allPages >= 3 && (
				<Button
					text={prevPage}
					className={`${style.link} ${prevPage === page ? style.active : ''}`}
					onClick={() => navigateToPage(prevPage)}
				/>
			)}
			{allPages >= 4 && (
				<Button
					text={middlePage}
					className={`${style.link} ${page === middlePage ? style.active : ''}`}
					onClick={() => navigateToPage(middlePage)}
				/>
			)}

			{allPages >= 5 && (
				<Button
					text={nextPage}
					className={`${style.link} ${page === nextPage ? style.active : ''}`}
					onClick={() => navigateToPage(nextPage)}
				/>
			)}

			{allPages > DEFAULT_PAGE && (
				<Button
					text={allPages.toString()}
					className={`${style.link} ${page === allPages ? style.active : ''}`}
					onClick={() => navigateToPage(allPages)}
				/>
			)}
			<Button
				text='&rarr;'
				className={style.link}
				onClick={onNextClick}
				disabled={page >= allPages}
			/>
		</div>
	);
};

export default Pagination;
