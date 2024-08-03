export const CARS_PER_PAGE = 7;
export const WINNERS_PER_PAGE = 10;

export const DEFAULT_PAGE = 1;

export enum ActionStatus {
	STARTED = 'started',
	STOPPED = 'stopped',
	DRIVE = 'drive',
}

export enum FetchMethods {
	POST = 'POST',
	PUT = 'PUT',
	PATCH = 'PATCH',
	DELETE = 'DELETE',
}

export const HEADER = {
	'Content-Type': 'application/json',
};

export enum Endpoints {
	GARAGE = '/garage',
	WINNERS = '/winners',
	ENGINE = '/engine',
}
