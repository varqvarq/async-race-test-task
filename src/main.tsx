import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {
	Navigate,
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from 'react-router-dom';

import App from './App';
import NotFound from './components/NotFound/NotFound';
import Garage from './pages/Garage/Garage';
import Winners from './pages/Winners/Winners';
import store from './redux/store';

import './index.css';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<App />} errorElement={<NotFound />}>
			<Route index element={<Navigate to='/garage' />} />
			<Route path='garage' element={<Garage />} />
			<Route path='winners' element={<Winners />} />
		</Route>
	)
);

ReactDOM.createRoot(document.getElementById('root')!).render(
	// <React.StrictMode>
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>
	// </React.StrictMode>
);
