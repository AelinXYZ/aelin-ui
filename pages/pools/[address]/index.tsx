//@ts-nocheck
import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import ViewPool from 'sections/AelinPool/ViewPool';

import useGetPoolByIdQuery from 'queries/pools/useGetPoolByIdQuery';
import { parsePool } from 'queries/pools/useGetPoolsQuery';
import Connector from 'containers/Connector';

const Pool: FC = () => {
	const router = useRouter();
	const { network } = Connector.useContainer();
	const { address } = router.query;
	const poolAddress = (address ?? '') as string;

	const poolQuery = useGetPoolByIdQuery({ id: poolAddress, networkId: network.id });

	const pool = useMemo(
		// @ts-ignore
		() => ((poolQuery?.data ?? null) != null ? parsePool(poolQuery.data) : null),
		[poolQuery?.data]
	);

	return <ViewPool pool={pool} poolAddress={poolAddress} />;
};

export default Pool;
