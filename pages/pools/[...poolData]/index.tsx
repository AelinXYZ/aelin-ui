import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import ViewPool from 'sections/Pools/ViewPool';

import useGetPoolByIdQuery from 'queries/pools/useGetPoolByIdQuery';
import { parsePool } from 'queries/pools/useGetPoolsQuery';

import Connector from 'containers/Connector';

import { nameToIdMapping } from 'constants/networks';

import SwitchNetworkModal from 'components/SwitchNetworkModal';

const Pool: FC = () => {
	const router = useRouter();
	const { network } = Connector.useContainer();

	const { poolData } = router.query;

	const address = poolData && poolData.length > 0 ? poolData[0] : null;

	const poolNetwork =
		poolData && poolData.length > 1 && Object.keys(nameToIdMapping).indexOf(poolData[1]) !== -1
			? poolData[1]
			: null;

	const poolAddress = (address ?? '') as string;

	const poolQuery = useGetPoolByIdQuery({
		id: poolAddress,
		networkId: network.id,
	});

	const pool = useMemo(
		// @ts-ignore
		() => ((poolQuery?.data ?? null) != null ? parsePool(poolQuery.data) : null),
		[poolQuery?.data]
	);

	const isPoolLoaded = !poolQuery.isLoading || poolQuery.failureCount > 0;

	return (
		<>
			<Head>
				<title>Aelin - {pool?.name ?? ''} Pool</title>
			</Head>

			<ViewPool pool={pool} poolAddress={poolAddress} />
			<SwitchNetworkModal pool={pool} poolNetwork={poolNetwork} isPoolLoaded={isPoolLoaded} />
		</>
	);
};

export default Pool;
