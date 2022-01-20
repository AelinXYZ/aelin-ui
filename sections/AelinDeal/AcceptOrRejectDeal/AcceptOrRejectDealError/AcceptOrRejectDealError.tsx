import { FC } from 'react';

import { Status } from 'components/DealStatus';

import { ErrorNote } from 'sections/shared/common';

interface AcceptOrRejectDealErrorProps {
	inputValue: number;
	isWithdraw: boolean;
	isMaxBalanceExceeded: boolean;
	dealRedemptionData: {
		status: Status;
		maxProRata: number;
		isOpenEligible: boolean;
	};
}

const AcceptOrRejectDealError: FC<AcceptOrRejectDealErrorProps> = ({
	isWithdraw,
	inputValue,
	isMaxBalanceExceeded,
	dealRedemptionData,
}) => {
	return (
		<>
			{isMaxBalanceExceeded && <ErrorNote>Max balance exceeded</ErrorNote>}

			{dealRedemptionData?.status === Status.ProRataRedemption &&
				!isWithdraw &&
				Number(dealRedemptionData.maxProRata ?? 0) < Number(inputValue ?? 0) && (
					<ErrorNote>More than pro rata amount</ErrorNote>
				)}

			{dealRedemptionData?.status === Status.Closed &&
				!isWithdraw &&
				Number(inputValue ?? 0) > 0 && <ErrorNote>Redemption period is closed</ErrorNote>}

			{dealRedemptionData?.status === Status.OpenRedemption &&
				!dealRedemptionData.isOpenEligible &&
				!isWithdraw &&
				Number(inputValue ?? 0) > 0 && (
					<ErrorNote>You are not eligible for open redemption period</ErrorNote>
				)}
		</>
	);
};

export default AcceptOrRejectDealError;
