import { FC, useMemo } from 'react';
import { ActionBoxType, TransactionType } from 'components/ActionBox';
import SectionDetails from 'sections/shared/SectionDetails';
import { Status } from 'components/DealStatus';

interface AcceptOrRejectDealProps {
	deal: any;
}

const AcceptOrRejectDeal: FC<AcceptOrRejectDealProps> = ({ deal }) => {
	const dealGridItems = useMemo(
		() => [
			{
				header: 'Name',
				subText: deal.name,
			},
			{
				header: 'Symbol',
				subText: deal.symbol,
			},
			{
				header: 'Underlying Deal Token',
				subText: deal.underlyingDealToken,
			},
			{
				header: 'Underlying Total',
				subText: deal.underlyingDealTokenTotal,
			},
			{
				header: 'Exchange rate',
				subText: deal.underlyingDealTokenTotal / deal.purchaseTokenTotalForDeal,
			},
			{
				header: 'Vesting Period',
				subText: deal.vestingPeriod,
			},
			{
				header: 'Vesting Cliff',
				subText: deal.vestingCliff,
			},
			{
				header: 'Status',
				subText: Status.DealOpen,
			},
			{
				header: 'Pro Rata Redemption Period',
				subText: deal.proRataRedemptionPeriod,
			},
			{
				header: 'Open Redemption Period',
				subText: deal.openRedemptionPeriod,
			},
			{
				header: 'Vesting Curve',
				subText: 'linear',
			},
		],
		[deal]
	);

	const handleAccept = (value: number) => {
		console.log('accepting deal with value:', value);
	};

	const handleReject = (value: number) => {
		console.log('rejecting deal with value:', value);
	};
	return (
		<SectionDetails
			actionBoxType={ActionBoxType.PendingDeal}
			gridItems={dealGridItems}
			onSubmit={(value, txnType) => {
				if (txnType === TransactionType.Withdraw) {
					handleReject(value);
				} else {
					handleAccept(value);
				}
			}}
		/>
	);
};

export default AcceptOrRejectDeal;
