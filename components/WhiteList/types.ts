import { FormikProps } from 'formik';

export interface IWhitelistComponent {
	formik: FormikProps<any>;
	setIsModalOpen: (isOpen: boolean) => void;
	isModalOpen: boolean;
}

export interface IWhitelist {
	address: string;
	amount: number;
	isSaved: boolean;
}

export interface IStyleColumnProps {
	align?: string;
	justify?: string;
	width?: string;
}

export interface IStyleRowProps {
	align?: string;
	justify?: string;
}
