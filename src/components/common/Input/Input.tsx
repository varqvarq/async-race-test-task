import clsx from 'clsx';

import style from './Input.module.scss';

interface InputProps {
	type?: string;
	name?: string;
	className?: string;
	placeholder?: string;
}

const Input: React.FC<InputProps> = ({
	type = 'text',
	name,
	className,
	placeholder,
}) => {
	const classNames = clsx(style.input, className);

	return (
		<input
			type={type}
			name={name}
			className={classNames}
			placeholder={placeholder}
		/>
	);
};

export default Input;
