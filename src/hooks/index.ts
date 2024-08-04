import { useEffect, useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { DEFAULT_PAGE } from '../constants';
import type { AppDispatch, RootState } from '../redux/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const usePageQuery = (): [number, (pageNumber: number) => void] => {
	const [searchParams, setSearchParams] = useSearchParams();

	const page = useMemo(() => {
		const query = searchParams.get('page');
		return query && !Number.isNaN(+query) && +query > 0 ? +query : DEFAULT_PAGE;
	}, [searchParams]);

	useEffect(() => {
		const query = searchParams.get('page');
		if (!query || Number.isNaN(+query) || +query <= 0) {
			setSearchParams({ page: DEFAULT_PAGE.toString() }, { replace: true });
		}
	}, [searchParams, setSearchParams, page]);

	const setPage = (pageNumber: number) => {
		setSearchParams({ page: pageNumber.toString() });
	};

	return [page, setPage];
};

export { usePageQuery };
