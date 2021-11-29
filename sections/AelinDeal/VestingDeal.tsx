import { FC, useMemo } from 'react';
import { FlexDiv } from 'components/common';
import Grid from 'components/Grid';
import TokenDisplay from 'components/TokenDisplay';

interface VestingDealProps {
	deal: any;
}

const VestingDeal: FC<VestingDealProps> = ({ deal }) => {
	const dealVestingGridItems = useMemo(
		() => [
			{
				header: 'Name',
				subText: deal.name,
			},
			{
				header: 'Amount of Deal Tokens',
				subText: 'some subText',
			},
			{
				header: 'Exchange rate',
				subText: deal.underlyingDealTokenTotal / deal.purchaseTokenTotalForDeal,
			},
			{
				header: 'Underlying Deal Token',
				subText: <TokenDisplay address={deal.underlyingDealToken} displayAddress={true} />,
			},
			{
				header: 'Vesting Cliff',
				subText: deal.vestingCliff,
			},
			{
				header: 'Vesting Period',
				subText: deal.vestingPeriod,
			},
			{
				header: 'Total Underlying Claimed',
				subText: 'some subText',
			},
		],
		[]
	);
	return (
		<FlexDiv>
			<Grid hasInputFields={false} gridItems={dealVestingGridItems} />
			<ActionBox
				actionBoxType={ActionBoxType.VestingDeal}
				onSubmit={(value) => {
					console.log('vest:', value);
				}}
				input={{ placeholder: '0', label: 'Vested: 2000 USDC', maxValue: 2000 }}
			/>
		</FlexDiv>
	);
};

export default VestingDeal;
