import { Outlet } from 'react-router-dom';

import Header from './components/Header/Header';

import './App.css';

const App: React.FC = () => (
	<>
		<Header />
		<main>
			<Outlet />
		</main>
	</>
);

export default App;
