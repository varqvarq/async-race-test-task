import { RaceWinner } from '../../types';

import { useAppSelector } from '../../hooks';
import { selectGarageData } from '../../redux/garage/garageSlice';
import CarIcon from '../CarIcon/CarIcon';
import Button from '../common/Button/Button';

import style from './WinnerBanner.module.scss';

interface WinnerBannerProps {
	winner: RaceWinner;
	setWinner: React.Dispatch<React.SetStateAction<RaceWinner | null>>;
}

const WinnerBanner: React.FC<WinnerBannerProps> = ({ winner, setWinner }) => {
	const winnerCar = useAppSelector(selectGarageData).cars.find(
		(car) => car.id === winner.id
	);

	return (
		<div className={style.winner}>
			<p className={style.winnerName}>
				Winner:
				<br /> <b>{winnerCar?.name}</b>
			</p>
			<CarIcon color={winnerCar?.color || 'white'} />
			<p className={style.winnerTime}>
				Time: <br />
				<b>{winner.time.toFixed(2)}</b> seconds
			</p>

			<Button
				text='&#x2715;'
				className={style.winnerCloseButton}
				onClick={() => setWinner(null)}
			/>
		</div>
	);
};

export default WinnerBanner;
