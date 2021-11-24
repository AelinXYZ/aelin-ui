import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import ViewPool from 'sections/AelinPool/ViewPool';

import useGetPoolByIdQuery from 'queries/pools/useGetPoolByIdQuery';
import { parsePool } from 'queries/pools/useGetPoolsQuery';
import TokenDisplay from 'components/TokenDisplay';

const Pool: FC = () => {
	const router = useRouter();
	const { address } = router.query;
	const poolAddress = (address ?? '') as string;

	const poolQuery = useGetPoolByIdQuery({ id: poolAddress });

	const pool = useMemo(
		// @ts-ignore
		() => ((poolQuery?.data ?? null) != null ? parsePool(poolQuery.data) : null),
		[poolQuery?.data]
	);

	console.log('poolQuery?.data', poolQuery?.data);
	console.log('pool', pool);

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

	const dealAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
	const dealVestingGridItems = useMemo(
		() => [
			{
				header: 'Name',
				subText: 'some subText',
			},
			{
				header: 'Amount of Deal Tokens',
				subText: 'some subText',
			},
			{
				header: 'Exchange rate',
				subText: 'some subText',
			},
			{
				header: 'Underlying Deal Token',
				subText: (
					<TokenDisplay address={'0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'} displayAddress />
				),
			},
			{
				header: 'Vesting Cliff',
				subText: 'some subText',
			},
			{
				header: 'Vesting Period',
				subText: 'some subText',
			},
			{
				header: 'Total Underlying Claimed',
				subText: 'some subText',
			},
		],
		[]
	);
	return (
		<ViewPool
			dealAddress={dealAddress}
			dealGridItems={dealGridItems}
			pool={pool}
			dealVestingGridItems={dealVestingGridItems}
			poolAddress={poolAddress}
		/>
	);
};

export default Pool;
