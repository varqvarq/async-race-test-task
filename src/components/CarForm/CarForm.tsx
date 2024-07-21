import Button from '../common/Button/Button';
import Input from '../common/Input/Input';

import style from './CarForm.module.scss';

// interface CarFormProps {}

const CarForm: React.FC = () => {
	const isEdit = false;

	return (
		<form>
			<Input placeholder='enter car name' name='carName' type='text' />
			<Input name='carColor' type='color' />
			<Button text={isEdit ? 'edit' : 'create'} />
		</form>
	);
};
<div className={style.carformContainer} />;

export default CarForm;
