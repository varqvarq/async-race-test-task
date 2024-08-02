import { QueryParams, ResponseData } from '../types';

export const BASE_URL = 'http://127.0.0.1:3000';

const request = async <T>(
	endpoint: string,
	params?: QueryParams,
	options: RequestInit = {}
): Promise<ResponseData<T>> => {
	const url = new URL(BASE_URL + endpoint);

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				url.searchParams.append(`_${key.toString()}`, value.toString());
			}
		});
	}

	const response = await fetch(url.toString(), options);

	if (!response.ok) {
		if (response.status === 404) {
			throw new Error('Resource not found');
		} else {
			throw new Error(`Response status: ${response.statusText}`);
		}
	}

	const totalCount = params?.limit
		? +(response.headers.get('X-Total-Count') || 0)
		: undefined;

	const data: T = await response.json();
	return { data, totalCount };
};

export default request;
