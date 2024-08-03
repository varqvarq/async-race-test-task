/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { IWinner, QueryParams, ResponseData } from '../../types';

import api from '../../api';
import type { RootState } from '../store';

export interface IWinnersInitialState {
	winners: {
		data: IWinner[];
		totalCount: number;
	};
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: IWinnersInitialState = {
	winners: {
		data: [],
		totalCount: 0,
	},
	status: 'idle',
	error: '',
};

export const fetchAllWinners = createAsyncThunk<
	ResponseData<IWinner[]>,
	QueryParams,
	{ rejectValue: string }
>('winners/fetchAllWinners', async (params, thunkApi) => {
	try {
		return await api.winners.getAll(params);
	} catch (e: unknown) {
		const error = e as Error;
		return thunkApi.rejectWithValue(error.message);
	}
});

export const getWinnerById = createAsyncThunk<
	IWinner,
	number,
	{ rejectValue: string }
>('winners/getWinnerById', async (id, thunkApi) => {
	try {
		const response = await api.winners.getById(id);
		return response.data;
	} catch (e) {
		const error = e as Error;
		return thunkApi.rejectWithValue(error.message);
	}
});

export const createWinner = createAsyncThunk<
	IWinner,
	IWinner,
	{ rejectValue: string }
>('winners/createWinner', async (winner, thunkApi) => {
	try {
		return (await api.winners.create(winner)).data;
	} catch (e) {
		const error = e as Error;
		return thunkApi.rejectWithValue(error.message);
	}
});

export const updateWinner = createAsyncThunk<
	IWinner,
	IWinner,
	{ rejectValue: string }
>('winners/updatewinner', async (winner: IWinner, thunkApi) => {
	try {
		return (await api.winners.update(winner.id, winner)).data;
	} catch (e) {
		const error = e as Error;
		return thunkApi.rejectWithValue(error.message);
	}
});

export const deleteWinner = createAsyncThunk<
	number,
	number,
	{ rejectValue: string }
>('winners/deletewinner', async (id, thunkApi) => {
	try {
		await api.winners.delete(id);
		return id;
	} catch (e: unknown) {
		const error = e as Error;
		return thunkApi.rejectWithValue(error.message);
	}
});

const winnersSlice = createSlice({
	name: 'winners',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllWinners.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchAllWinners.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.winners = action.payload;
			})
			.addCase(fetchAllWinners.rejected, (state, action) => {
				state.status = 'failed';
				if (action.error.message !== undefined)
					state.error = action.error.message;
			})
			.addCase(deleteWinner.fulfilled, (state, action) => {
				state.winners.data = state.winners.data.filter(
					(winner) => winner.id !== action.payload
				);
				state.winners.totalCount--;
			})
			.addCase(updateWinner.fulfilled, (state, action) => {
				state.winners.data = state.winners.data.map((winner) =>
					winner.id === action.payload.id ? action.payload : winner
				);
			})
			.addCase(createWinner.fulfilled, (state, action) => {
				state.winners.data.push(action.payload);
			});
	},
});

export const selectWinnersData = (state: RootState) => state.winnersReducer;

export default winnersSlice.reducer;
