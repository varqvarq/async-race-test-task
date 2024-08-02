import { ICar, IWinner, QueryParams, ResponseData } from '../types';

import request, { BASE_URL } from './request';

const createApiMethods = <T>(endpoint: string) => ({
	async getAll(params?: QueryParams): Promise<ResponseData<T[]>> {
		const defaultParams = { page: 1, limit: 7, ...params };
		return request<T[]>(endpoint, defaultParams);
	},

	async getById(id: number): Promise<ResponseData<T>> {
		return request(`${endpoint}/${id}`);
	},

	async create(item: T): Promise<ResponseData<T>> {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(item),
		};

		return request<T>(endpoint, undefined, options);
	},

	async update(id: number, item: T): Promise<ResponseData<T>> {
		const options: RequestInit = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(item),
		};

		return request<T>(`${endpoint}/${id}`, undefined, options);
	},

	async delete(id: number): Promise<void> {
		await request<void>(`${endpoint}/${id}`, undefined, { method: 'DELETE' });
	},
});

const api = {
	garage: createApiMethods<ICar>('/garage'),
	winners: createApiMethods<IWinner>('/winners'),
};

export default api;

export const toggleEngine = async (
	id: number,
	status: 'started' | 'stopped'
) => {
	const options = {
		method: 'PATCH',
	};

	const url = new URL(`${BASE_URL}/engine`);
	url.searchParams.append(`id`, id.toString());
	url.searchParams.append(`status`, status.toString());

	const response = await fetch(url, options);

	if (!response.ok) {
		throw new Error(`Engine error ${response.statusText}`);
	}

	const data = await response.json();
	return data;
};

export const drive = async (id: number) => {
	const options: RequestInit = {
		method: 'PATCH',
	};

	const url = new URL(`${BASE_URL}/engine`);
	url.searchParams.append(`id`, id.toString());
	url.searchParams.append(`status`, 'drive');

	const response = await fetch(url, options);
	const exception = new Error();
	exception.name = 'CustomError';
	exception.message = '500';

	if (!response.ok && response.status === 500) {
		throw exception;
	}

	const data = await response.json();
	return data;
};
