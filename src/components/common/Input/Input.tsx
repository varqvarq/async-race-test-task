import clsx from 'clsx';

import style from './Input.module.scss';

interface InputProps {
	type?: string;
	name?: string;
	className?: string;
	placeholder?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
	type = 'text',
	name,
	className,
	placeholder,
	value,
	onChange,
}) => {
	const classNames = clsx(style.input, className);

	return (
		<input
			type={type}
			name={name}
			className={classNames}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
		/>
	);
};

export default Input;
