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

export interface ResponseData<T> {
	data: T;
	totalCount?: number;
}

export interface QueryParams {
	page?: number;
	limit?: number;
	sort?: 'id' | 'wins' | 'time';
	order?: 'ASC' | 'DESC';
}
