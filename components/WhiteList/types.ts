import { FormikProps } from "formik";

export interface IWhitelistComponent {
  formik: FormikProps<any>;
  isOpen: boolean;
  setOpen: Function;
}

export interface IWhitelist {
  address: string;
  amount: number;
}

export interface IStyleProps {
  align?: string;
}