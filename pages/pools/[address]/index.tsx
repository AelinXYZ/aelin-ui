import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import ViewPool from 'sections/AelinPool/ViewPool';

import useGetPoolByIdQuery from 'queries/pools/useGetPoolByIdQuery';
import { parsePool } from 'queries/pools/useGetPoolsQuery';

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

	return <ViewPool pool={pool} poolAddress={poolAddress} />;
};

export default Pool;
