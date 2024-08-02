import { Outlet } from 'react-router-dom';

import Header from './components/Header/Header';

import './App.css';
import 'normalize.css';

const App: React.FC = () => (
	<main>
		<Header />
		<Outlet />
	</main>
);

export default App;
