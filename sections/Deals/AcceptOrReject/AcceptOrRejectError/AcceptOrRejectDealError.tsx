import { FC } from 'react';
import styled from 'styled-components';

import { ErrorNote } from 'sections/shared/common';

interface AcceptOrRejectDealErrorProps {
	isWithdraw: boolean;
	hasAmount: boolean;
	isMaxBalanceExceeded: boolean;
	isProRataAmountExcceded: boolean;
	isRedemptionPeriodClosed: boolean;
	isProRataRedemptionPeriod: boolean;
	isEligibleForOpenRedemption: boolean;
}

const AcceptOrRejectDealError: FC<AcceptOrRejectDealErrorProps> = ({
	hasAmount,
	isWithdraw,
	isMaxBalanceExceeded,
	isProRataAmountExcceded,
	isRedemptionPeriodClosed,
	isProRataRedemptionPeriod,
	isEligibleForOpenRedemption,
}) => (
	<>
		{isMaxBalanceExceeded && <StyledErrorNote>Max balance exceeded</StyledErrorNote>}

		{isProRataRedemptionPeriod && !isWithdraw && isProRataAmountExcceded && (
			<StyledErrorNote>More than pro rata amount</StyledErrorNote>
		)}

		{isRedemptionPeriodClosed && !isWithdraw && hasAmount && (
			<StyledErrorNote>Redemption period is closed</StyledErrorNote>
		)}

		{isEligibleForOpenRedemption && !isWithdraw && hasAmount && (
			<StyledErrorNote>You are not eligible for open redemption period</StyledErrorNote>
		)}
	</>
);

const StyledErrorNote = styled(ErrorNote)`
	margin-top 5px;
`;

export default AcceptOrRejectDealError;
