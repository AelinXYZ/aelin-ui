import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import ViewPool from 'sections/AelinPool/ViewPool';

const Pool: FC = () => {
	const router = useRouter();
	const { address } = router.query;
	const poolAddress = (address ?? '') as string;

	const poolGridItems = useMemo(
		() => [
			{
				header: 'Sponsor',
				subText: 'some subText',
			},
			{
				header: 'My Capital',
				subText: 'some subText',
			},
			{
				header: 'Total Capital',
				subText: 'some subText',
			},
			{
				header: 'Currency',
				subText: 'some subText',
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
				subText: 'some subText',
			},
			{
				header: 'Expiration',
				subText: 'some subText',
			},
			{
				header: 'Contributions',
				subText: 'some subText',
			},
		],
		[]
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

	return (
		<ViewPool
			dealAddress={dealAddress}
			dealGridItems={dealGridItems}
			poolGridItems={poolGridItems}
			poolAddress={poolAddress}
		/>
	);
};

export default Pool;
