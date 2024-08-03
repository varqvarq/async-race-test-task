import { ActionStatus } from '../constants';

export interface ICar {
	name: string;
	color: string;
	id?: number;
}

export interface IWinner {
	wins: number;
	time: number;
	id: number;
}

export interface RaceWinner {
	id: number;
	time: number;
}

export interface ResponseData<T> {
	data: T;
	totalCount: number;
}

export interface QueryParams {
	page?: number;
	limit?: number;
	sort?: SortFields;
	order?: SortOrder;
	id?: number;
	status?: ActionStatus;
}

type SortFields = 'id' | 'wins' | 'time';
type SortOrder = 'ASC' | 'DESC';

export interface CarEngineInfo {
	velocity: number;
	distance: number;
}
