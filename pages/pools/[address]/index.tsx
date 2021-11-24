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
		<ViewPool pool={pool} dealVestingGridItems={dealVestingGridItems} poolAddress={poolAddress} />
	);
};

export default Pool;
