import { Status } from 'components/DealStatus';

export enum Privacy {
	PUBLIC = 'public',
	PRIVATE = 'private',
}

export enum Allocation {
	MAX = 'max',
	DEALLOCATE = 'deallocate',
}

export const statusToText = (status: Status): string => {
	switch (status) {
		case Status.PoolOpen:
			return 'Pool Open';
		case Status.DealOpen:
			return 'Deal';
		case Status.SeekingDeal:
			return 'Seeking Deal';
		case Status.ProRataRedemption:
			return 'Round 1: Pro Rata Redemption';
		case Status.OpenRedemption:
			return 'Round 2: Open Redemption';
		case Status.FundingDeal:
			return 'Funding Deal';
		case Status.Closed:
			return 'Closed';
	}
};

export const initialWhitelistValues = [
	...new Array(5).fill({
		address: '',
		amount: null,
		isSaved: false,
	}),
];

export const firstAelinPoolDealID = '0x06bad08305074da59fe98d0e85bad8f524e167df';

export const swimmingPoolID = '0x8ab60972950438970c1210c37ae3d71585f18788';

export const vAelinPoolID = '0x3074306c0cc9200602bfc64beea955928dac56dd';
