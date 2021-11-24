import { FC, useMemo } from 'react';
import { ActionBoxType, TransactionType } from 'components/ActionBox';
import SectionDetails from 'sections/shared/SectionDetails';
import useGetDealByIdQuery, { parseDeal } from 'queries/deals/useGetDealByIdQuery';

interface AcceptOrRejectDealProps {
	dealAddress: string;
}

const AcceptOrRejectDeal: FC<AcceptOrRejectDealProps> = ({ dealAddress }) => {
	const dealQuery = useGetDealByIdQuery({ id: dealAddress });

	const deal = useMemo(
		// @ts-ignore
		() => ((dealQuery?.data ?? null) != null ? parseDeal(dealQuery.data) : null),
		[dealQuery?.data]
	);
	const dealGridItems = useMemo(
		() => [
			{
				header: 'Name',
				subText: 'some subText',
			},
			{
				header: 'Currency',
				subText: 'some subText',
			},
			{
				header: 'Exchange rate',
				subText: 'some subText',
			},
			{
				header: 'Vesting Period',
				subText: 'some subText',
			},
			{
				header: 'Vesting Cliff',
				subText: 'some subText',
			},
			{
				header: 'Status',
				subText: 'some subText',
			},
			{
				header: 'Redemption Period',
				subText: 'some subText',
			},
			{
				header: 'Vesting Curve',
				subText: 'some subText',
			},
			{
				header: 'Discount',
				subText: 'some subText',
			},
		],
		[]
	);
	return (
		<SectionDetails
			actionBoxType={ActionBoxType.PendingDeal}
			gridItems={dealGridItems}
			onSubmit={(value, txnType) => {
				if (txnType === TransactionType.Withdraw) {
					console.log('withdral', value);
				} else {
					console.log('click me to accept or reject: ', `tokens: ${value}`);
				}
			}}
		/>
	);
};

export default AcceptOrRejectDeal;
