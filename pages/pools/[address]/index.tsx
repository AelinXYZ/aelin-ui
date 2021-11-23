import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import ViewPool from 'sections/AelinPool/ViewPool';

import useGetPoolByIdQuery from 'queries/pools/useGetPoolByIdQuery';
import { parsePool } from 'queries/pools/useGetPoolsQuery';
import { truncateAddress } from 'utils/crypto';
import TimeLeft from 'components/TimeLeft';
import Ens from 'components/Ens';

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

	const poolGridItems = useMemo(
		() => [
			{
				header: 'Sponsor',
				subText: <Ens address={pool?.sponsor ?? ''} />,
			},
			{
				header: 'My Capital',
				subText: '',
			},
			{
				header: 'Purchase Token Cap',
				subText: pool?.purchaseTokenCap.toNumber() ?? '',
			},
			{
				header: 'Purchase Token',
				subText: truncateAddress(pool?.purchaseToken ?? ''),
			},
			{
				header: 'Ownership',
				subText: 'some subText',
			},
			{
				header: 'Status',
				subText: 'some subText',
			},
			{
				header: 'Sponsor Fee',
				subText: pool?.sponsorFee || 0,
			},
			{
				header: 'Purchase Expiration',
				subText: <TimeLeft timeLeft={pool?.duration ?? 0} />,
			},
			{
				header: 'Pool Duration',
				subText: <TimeLeft timeLeft={pool?.duration ?? 0} />,
			},
		],
		[pool]
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
				subText: 'some subText',
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
			poolGridItems={poolGridItems}
			dealVestingGridItems={dealVestingGridItems}
			poolAddress={poolAddress}
		/>
	);
};

export default Pool;
