import { FormikProps } from 'formik';

export interface WhitelistComponentProps {
	formik: FormikProps<any>;
	setIsModalOpen: (isOpen: boolean) => void;
	isModalOpen: boolean;
}

export interface WhitelistProps {
	address: string;
	amount: number;
	isSaved: boolean;
}

export interface StyleColumnProps {
	align?: string;
	justify?: string;
	width?: string;
}

export interface StyleRowProps {
	align?: string;
	justify?: string;
}
