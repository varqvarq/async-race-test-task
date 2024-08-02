import { useNavigate } from 'react-router-dom';

import Button from '../common/Button/Button';

import style from './NotFound.module.scss';

const NotFound: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className={style.notfoundContainer}>
			<h2>Page Not Found</h2>
			<Button text='Go home' onClick={() => navigate('/')} />
		</div>
	);
};

export default NotFound;
