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
				header: 'some header',
				subText: 'some subText',
			},
			{
				header: 'some header',
				subText: 'some subText',
			},
			{
				header: 'some header',
				subText: 'some subText',
			},
			{
				header: 'some header',
				subText: 'some subText',
			},
			{
				header: 'some header',
				subText: 'some subText',
			},
			{
				header: 'some header',
				subText: 'some subText',
			},
			{
				header: 'some header',
				subText: 'some subText',
			},
			{
				header: 'some header',
				subText: 'some subText',
			},
			{
				header: 'some header',
				subText: 'some subText',
			},
		],
		[]
	);

	return <ViewPool poolGridItems={poolGridItems} poolAddress={poolAddress} />;
};

export default Pool;
