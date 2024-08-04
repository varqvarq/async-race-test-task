import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';

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

	const buttonClasses = {
		defaultPage: clsx(style.link, { [style.active]: page === DEFAULT_PAGE }),
		prevPage: clsx(style.link, {
			[style.active]: page === prevPage,
			[style.prevButton]: allPages >= 5,
		}),
		middlePage: clsx(style.link, { [style.active]: page === middlePage }),
		nextPage: clsx(style.link, style.nextButton, {
			[style.active]: page === nextPage,
		}),
		allPages: clsx(style.link, { [style.active]: page === allPages }),
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
				className={buttonClasses.defaultPage}
				onClick={() => navigateToPage(DEFAULT_PAGE)}
			/>

			{allPages >= 3 && (
				<Button
					text={prevPage}
					className={buttonClasses.prevPage}
					onClick={() => navigateToPage(prevPage)}
				/>
			)}
			{allPages >= 4 && (
				<Button
					text={middlePage}
					className={buttonClasses.middlePage}
					onClick={() => navigateToPage(middlePage)}
				/>
			)}

			{allPages >= 5 && (
				<Button
					text={nextPage}
					className={buttonClasses.nextPage}
					onClick={() => navigateToPage(nextPage)}
				/>
			)}

			{allPages > DEFAULT_PAGE && (
				<Button
					text={allPages.toString()}
					className={buttonClasses.allPages}
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
