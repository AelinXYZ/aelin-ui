export interface IUploadCSV {
	onUploadCSV: Function;
}

export interface ICSVResponse {
	data: string[];
}

export interface WhitelistProps {
	address: string;
	amount: number | null;
	isSaved: boolean;
}
