import {
	CarEngineInfo,
	ICar,
	IWinner,
	QueryParams,
	ResponseData,
} from '../types';

import { ActionStatus, Endpoints, FetchMethods, HEADER } from '../constants';
import request, { BASE_URL } from './request';

const createApiMethods = <T>(endpoint: string) => ({
	async getAll(params?: QueryParams): Promise<ResponseData<T[]>> {
		const defaultParams: QueryParams = { page: 1, limit: 7, ...params };
		return request<T[]>(endpoint, defaultParams);
	},

	async getById(id: number): Promise<ResponseData<T>> {
		return request(`${endpoint}/${id}`);
	},

	async create(item: T): Promise<ResponseData<T>> {
		const options: RequestInit = {
			method: FetchMethods.POST,
			headers: HEADER,
			body: JSON.stringify(item),
		};

		return request<T>(endpoint, undefined, options);
	},

	async update(id: number, item: T): Promise<ResponseData<T>> {
		const options: RequestInit = {
			method: FetchMethods.PUT,
			headers: HEADER,
			body: JSON.stringify(item),
		};

		return request<T>(`${endpoint}/${id}`, undefined, options);
	},

	async delete(id: number): Promise<void> {
		await request<void>(`${endpoint}/${id}`, undefined, {
			method: FetchMethods.DELETE,
		});
	},
});

export const toggleEngine = async (
	id: number,
	status: ActionStatus.STARTED | ActionStatus.STOPPED
) => {
	const params: QueryParams = {
		id,
		status,
	};

	const options: RequestInit = {
		method: FetchMethods.PATCH,
	};

	return request<CarEngineInfo>(Endpoints.ENGINE, params, options);
};

export const drive = async (id: number) => {
	const url = new URL(BASE_URL + Endpoints.ENGINE);

	url.searchParams.append('id', id.toString());
	url.searchParams.append('status', ActionStatus.DRIVE);

	const options: RequestInit = {
		method: FetchMethods.PATCH,
	};

	const response = await fetch(url, options);

	if (!response.ok) {
		if (response.status === 500) {
			throw new Error('engine break');
		} else {
			throw new Error(response.statusText);
		}
	}
};

const api = {
	garage: createApiMethods<ICar>(Endpoints.GARAGE),
	winners: createApiMethods<IWinner>(Endpoints.WINNERS),
};

export default api;
