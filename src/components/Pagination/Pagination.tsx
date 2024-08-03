import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { DEFAULT_PAGE } from '../../constants';
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
	const [params] = useSearchParams({ page: DEFAULT_PAGE.toString() });
	const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
	const navigate = useNavigate();

	const pageParams = params.get('page');
	const page = pageParams ? +pageParams : DEFAULT_PAGE;

	const allPages = Math.ceil(totalCount / elementsPerPage);

	useEffect(() => {
		if (page) {
			setCurrentPage(page);
		}
	}, [page]);

	const onPrevClick = () => {
		if (currentPage > DEFAULT_PAGE) {
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
				onClick={onPrevClick}
				className={style.link}
				disabled={currentPage <= DEFAULT_PAGE}
			/>
			<Button
				text={DEFAULT_PAGE.toString()}
				className={`${style.link} ${currentPage === DEFAULT_PAGE ? style.active : ''}`}
				onClick={() => onPageChange(DEFAULT_PAGE)}
			/>

			{currentPage > DEFAULT_PAGE && currentPage < allPages && (
				<Button
					text={currentPage.toString()}
					className={`${style.link} ${style.active}`}
					onClick={() => onPageChange(currentPage)}
				/>
			)}

			{allPages > DEFAULT_PAGE && (
				<Button
					text={allPages.toString()}
					className={`${style.link} ${currentPage === allPages ? style.active : ''}`}
					onClick={() => onPageChange(allPages)}
				/>
			)}
			<Button
				text='&rarr;'
				className={style.link}
				onClick={onNextClick}
				disabled={currentPage >= allPages}
			/>
		</div>
	);
};

export default Pagination;
