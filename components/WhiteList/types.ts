export interface IWhiteListComponent {
  formik: any;
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