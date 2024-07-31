import { configureStore } from '@reduxjs/toolkit';

import garageReducer from './garage/garageSlice';
import winnersReducer from './winners/winnerSlice';

const store = configureStore({
	reducer: {
		garageReducer,
		winnersReducer,
	},
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
