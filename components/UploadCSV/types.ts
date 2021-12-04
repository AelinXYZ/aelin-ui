export interface IUploadCSV {
  onUploadCSV: Function;
};

export interface ICSVResponse {
  data: string[];
};

export interface IWhitelist {
  address: string;
  amount: number | null;
};
