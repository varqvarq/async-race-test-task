import { useLocation, useNavigate } from 'react-router-dom';

import Button from '../common/Button/Button';

import style from './Header.module.scss';

const Header: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const savePageNumber = () => {
		const pageNumber = new URLSearchParams(location.search).get('page') || '1';

		if (location.pathname === '/garage') {
			sessionStorage.setItem('garagePage', pageNumber);
		} else if (location.pathname === '/winners') {
			sessionStorage.setItem('winnersPage', pageNumber);
		}
	};

	const handleNavigation = (path: string) => {
		savePageNumber();

		const savedPage =
			path === '/garage'
				? sessionStorage.getItem('garagePage')
				: sessionStorage.getItem('winnersPage');

		const pageNumber = savedPage ? `?page=${savedPage}` : '';

		navigate(path + pageNumber);
	};

	return (
		<header className={style.header}>
			<Button
				text='Garage'
				disabled={location.pathname === '/garage'}
				onClick={() => handleNavigation('/garage')}
			/>
			<Button
				text='Winners'
				disabled={location.pathname === '/winners'}
				onClick={() => handleNavigation('/winners')}
			/>
		</header>
	);
};

export default Header;
