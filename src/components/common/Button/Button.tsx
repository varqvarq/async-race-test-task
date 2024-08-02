import { ReactNode } from 'react';

import clsx from 'clsx';

import style from './Button.module.scss';

interface ButtonProps {
	type?: 'submit' | 'reset' | 'button';
	text?: string | number;
	className?: string;
	onClick?: (e: React.SyntheticEvent) => void;
	disabled?: boolean;
	children?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	text,
	type = 'button',
	className,
	onClick,
	disabled,
	children,
}) => {
	const classNames = clsx(style.button, className);

	return (
		<button
			type={type}
			className={classNames}
			onClick={onClick}
			disabled={disabled}
		>
			{text}
			{children}
		</button>
	);
};

export default Button;
