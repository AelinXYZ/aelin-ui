import { useMemo } from 'react';

import DealActionBox from './components/DealActionBox';
import StakeActionBox from './components/StakeActionBox';
import FundPoolActionBox from './components/FundPoolActionBox';
import VestingDealActionBox from './components/VestingDealActionBox';

export enum ActionBoxType {
	FundPool = 'FundPool',
	AcceptOrRejectDeal = 'ACCEPT_OR_REJECT_DEAL',
	VestingDeal = 'VESTING_DEAL',
	Stake = 'STAKE',
	Withdraw = 'WITHDRAW',
}

interface ActionBoxKindProps {
	actionBoxType: ActionBoxType;
}

const ActionBoxKind = ({ actionBoxType, ...rest }: ActionBoxKindProps) => {
	const actionBoxKind = useMemo(
		() => ({
			[ActionBoxType.FundPool]: <FundPoolActionBox {...rest}></FundPoolActionBox>,
			[ActionBoxType.AcceptOrRejectDeal]: <DealActionBox {...rest}></DealActionBox>,
			[ActionBoxType.VestingDeal]: <VestingDealActionBox {...rest}></VestingDealActionBox>,
			[ActionBoxType.Stake]: <StakeActionBox {...rest}></StakeActionBox>,
		}),
		[rest]
	);

	return actionBoxKind[actionBoxType];
};

export default ActionBoxKind;
