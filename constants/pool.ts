import { Status } from 'components/DealStatus';

export enum Privacy {
	PUBLIC = 'public',
	PRIVATE = 'private',
}

export const statusToText = (status: Status): string => {
	switch (status) {
		case Status.PoolOpen:
			return 'Pool Open';
		case Status.DealOpen:
			return 'Deal Open';
		case Status.SeekingDeal:
			return 'Seeking Deal';
		case Status.ProRataRedemption:
			return 'Pro Rata Redemption';
		case Status.OpenRedemption:
			return 'Open Redemption';
		case Status.FundingDeal:
			return 'Funding Deal';
		case Status.Closed:
			return 'Closed';
	}
};

export const initialWhitelistValues = [
	...new Array(5).fill(
		{
			address: '',
			amount: null
		}
	)
];

