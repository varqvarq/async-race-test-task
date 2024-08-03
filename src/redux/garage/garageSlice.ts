/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { ICar, QueryParams, ResponseData } from '../../types';

import api from '../../api';
import type { RootState } from '../store';

export interface IGarageInitialState {
	cars: ICar[];
	totalCount: number;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: IGarageInitialState = {
	cars: [],
	totalCount: 0,
	status: 'idle',
	error: '',
};

export const fetchAllCars = createAsyncThunk<
	ResponseData<ICar[]>,
	QueryParams,
	{ rejectValue: string }
>('garage/fetchAllCars', async (params: QueryParams, thunkApi) => {
	try {
		return await api.garage.getAll(params);
	} catch (e: unknown) {
		const error = e as Error;
		return thunkApi.rejectWithValue(error.message);
	}
});

export const getCarById = createAsyncThunk<
	ICar,
	number,
	{ rejectValue: string }
>('garage/getCarById', async (id, thunkApi) => {
	try {
		const response = await api.garage.getById(id);
		return response.data;
	} catch (e) {
		const error = e as Error;
		return thunkApi.rejectWithValue(error.message);
	}
});

export const createCar = createAsyncThunk<ICar, ICar, { rejectValue: string }>(
	'garage/createCar',
	async (car, thunkApi) => {
		try {
			return (await api.garage.create(car)).data;
		} catch (e) {
			const error = e as Error;
			return thunkApi.rejectWithValue(error.message);
		}
	}
);

export const updateCar = createAsyncThunk<ICar, ICar, { rejectValue: string }>(
	'garage/updateCar',
	async (car, thunkApi) => {
		try {
			const { id, ...carData } = car;
			return (await api.garage.update(id!, carData)).data;
		} catch (e) {
			const error = e as Error;
			return thunkApi.rejectWithValue(error.message);
		}
	}
);

export const deleteCar = createAsyncThunk<
	number,
	number,
	{ rejectValue: string }
>('garage/deleteCar', async (id, thunkApi) => {
	try {
		await api.garage.delete(id);
		return id;
	} catch (e: unknown) {
		const error = e as Error;
		return thunkApi.rejectWithValue(error.message);
	}
});

const garageSlice = createSlice({
	name: 'garage',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllCars.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchAllCars.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.cars = action.payload.data;
				state.totalCount = action.payload.totalCount;
			})
			.addCase(fetchAllCars.rejected, (state, action) => {
				state.status = 'failed';
				if (action.error.message !== undefined)
					state.error = action.error.message;
			})
			.addCase(deleteCar.fulfilled, (state, action) => {
				state.cars = state.cars.filter((car) => car.id !== action.payload);
				state.totalCount--;
			})
			.addCase(updateCar.fulfilled, (state, action) => {
				state.cars = state.cars.map((car) =>
					car.id === action.payload.id ? action.payload : car
				);
			})
			.addCase(createCar.fulfilled, (state, action) => {
				state.cars.push(action.payload);
			});
	},
});

export const selectGarageData = (state: RootState) => state.garageReducer;

export default garageSlice.reducer;
