import clsx from 'clsx';

import style from './Button.module.scss';

interface ButtonProps {
	type?: 'submit' | 'reset' | 'button';
	text?: string;
	className?: string;
}

const Button: React.FC<ButtonProps> = ({
	text,
	type = 'button',
	className,
}) => {
	const classNames = clsx(style.button, className);

	return (
		<button type={type} className={classNames}>
			{text}
		</button>
	);
};

export default Button;
