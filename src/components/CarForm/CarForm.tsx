import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';
import {
	createCar,
	fetchAllCars,
	selectGarageData,
	updateCar,
} from '../../redux/garage/garageSlice';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';

import style from './CarForm.module.scss';

interface CarFormProps {
	carId: number | undefined;
	setCarId: React.Dispatch<React.SetStateAction<number | undefined>>;
	raceInProgress: boolean;
}

const CarForm: React.FC<CarFormProps> = ({
	carId,
	setCarId,
	raceInProgress,
}) => {
	const carToEdit = useAppSelector(selectGarageData).cars.find(
		(car) => car.id === carId
	);
	const dispatch = useAppDispatch();

	const [searchParams] = useSearchParams();
	const query = searchParams.get('page');
	const page = query ? +query : 1;

	const [carName, setCarName] = useState<string>('');
	const [carColor, setCarColor] = useState<string>('#ffffff');
	const [isEdit, setIsEdit] = useState(false);

	useEffect(() => {
		if (!carToEdit) {
			return;
		}
		setIsEdit(true);
		setCarName(carToEdit.name);
		setCarColor(carToEdit.color);
	}, [carToEdit]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === 'carName') {
			setCarName(e.target.value);
		} else {
			setCarColor(e.target.value);
		}
	};

	const resetForm = () => {
		setCarId(undefined);
		setIsEdit(false);
		setCarColor('#ffffff');
		setCarName('');
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isEdit && carToEdit) {
			await dispatch(
				updateCar({ name: carName, color: carColor, id: carToEdit.id })
			);
			await dispatch(fetchAllCars({ page }));
		} else if (carName) {
			await dispatch(createCar({ name: carName, color: carColor }));
			await dispatch(fetchAllCars({ page }));
		}
		resetForm();
	};

	return (
		<form onSubmit={handleSubmit} className={style.carForm}>
			<Input
				placeholder='enter car name'
				name='carName'
				type='text'
				value={carName}
				onChange={handleInputChange}
				className={style.nameInput}
			/>
			<Input
				name='carColor'
				type='color'
				value={carColor}
				onChange={handleInputChange}
				className={style.colorInput}
			/>
			<Button
				text={isEdit ? 'edit' : 'create'}
				type='submit'
				className={style.submitButton}
				disabled={raceInProgress}
			/>
			{isEdit && (
				<Button
					text='cancel'
					type='reset'
					className={style.submitButton}
					onClick={resetForm}
				/>
			)}
		</form>
	);
};

export default CarForm;
