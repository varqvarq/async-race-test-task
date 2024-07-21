import clsx from 'clsx';

import style from './Button.module.scss';

interface ButtonProps {
	type?: 'submit' | 'reset' | 'button';
	text?: string;
	className?: string;
	onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
	text,
	type = 'button',
	className,
	onClick,
}) => {
	const classNames = clsx(style.button, className);

	return (
		<button type={type} className={classNames} onClick={onClick}>
			{text}
		</button>
	);
};

export default Button;
