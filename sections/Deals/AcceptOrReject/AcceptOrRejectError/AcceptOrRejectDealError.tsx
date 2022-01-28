import { FC } from 'react';

import { ErrorNote } from 'sections/shared/common';

interface AcceptOrRejectDealErrorProps {
	isWithdraw: boolean;
	hasAmount: boolean;
	isEligibleForOpenRedemption: boolean;
	isMaxBalanceExceeded: boolean;
	isProRataAmountExcceded: boolean;
	isRedemptionPeriodClosed: boolean;
	isProRataRedemptionPeriod: boolean;
}

const AcceptOrRejectDealError: FC<AcceptOrRejectDealErrorProps> = ({
	hasAmount,
	isWithdraw,
	isEligibleForOpenRedemption,
	isMaxBalanceExceeded,
	isProRataAmountExcceded,
	isRedemptionPeriodClosed,
	isProRataRedemptionPeriod,
}) => (
	<>
		{isMaxBalanceExceeded && <ErrorNote>Max balance exceeded</ErrorNote>}

		{isProRataRedemptionPeriod && !isWithdraw && isProRataAmountExcceded && (
			<ErrorNote>More than pro rata amount</ErrorNote>
		)}

		{isRedemptionPeriodClosed && !isWithdraw && hasAmount && (
			<ErrorNote>Redemption period is closed</ErrorNote>
		)}

		{isEligibleForOpenRedemption && !isWithdraw && hasAmount && (
			<ErrorNote>You are not eligible for open redemption period</ErrorNote>
		)}
	</>
);

export default AcceptOrRejectDealError;
