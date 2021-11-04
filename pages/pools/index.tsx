import { FC, useMemo, useState } from 'react';
import { CellProps } from 'react-table';
import { useRouter } from 'next/router';

import useGetPoolsQuery, { parsePools, GQLDirection } from 'queries/pools/useGetPoolsQuery';
import { PageLayout } from 'sections/Layout';
import Table from 'components/Table';
import { Status } from 'components/DealStatus';
import Currency from 'components/Currency';
import DealStatus from 'components/DealStatus';
import TimeLeft from 'components/TimeLeft';
import { formatNumber } from 'utils/numbers';
import { truncateAddress } from 'utils/crypto';
import { MAX_RESULTS_PER_PAGE } from 'constants/defaults';

const Pools: FC = () => {
	const router = useRouter();
	// TODO turn this into a query since we are only grabbing the first 10
	// I have already modified the subgraph code
	const totalPools = 121;
	const [currPage, setCurrPage] = useState<number>(0);
	const [timestampCursor, setTimestampCursor] = useState<number>(Math.round(Date.now() / 1000));
	const [paginationDirection, setPaginationDirection] = useState<GQLDirection>(GQLDirection.LT);
	const poolsQuery = useGetPoolsQuery({
		timestamp: timestampCursor,
		direction: paginationDirection,
	});
	const pools = useMemo(() => parsePools(poolsQuery?.data), [poolsQuery?.data]);

	const data = useMemo(() => {
		console.log('pools returned', pools);
		const list = pools.map(
			({ sponsorFee, duration, sponsor, name, address, purchaseToken, purchaseTokenCap }) => ({
				sponsor: truncateAddress(sponsor),
				name,
				address: truncateAddress(address),
				purchaseToken: truncateAddress(purchaseToken), // TODO get symbol
				contributions: 1000000, // TODO get contributions
				cap: purchaseTokenCap,
				duration,
				fee: sponsorFee,
				status: Status.OPEN, // TODO get status
			})
		);

		console.log('note this will change with pagination');
		if (router.query.active === 'true') {
			return list.filter(({ status }) => status === Status.OPEN || status === Status.DEAL);
		}
		return list;
	}, [pools, router.query.active]);

	const columns = useMemo(
		() => [
			{ Header: 'sponsor', accessor: 'sponsor' },
			{ Header: 'name', accessor: 'name' },
			{
				Header: 'purchase token',
				accessor: 'purchaseToken',
				// eslint-disable-next-line react/display-name
				Cell: (cellProps: CellProps<any, any>) => {
					return <Currency ticker={cellProps.value} />;
				},
			},
			{
				Header: 'contributions',
				accessor: 'contributions',
				Cell: (cellProps: CellProps<any, any>) => {
					return `${formatNumber(cellProps.value)}`;
				},
			},
			{
				Header: 'cap',
				accessor: 'cap',
				Cell: (cellProps: CellProps<any, any>) => {
					return `${formatNumber(cellProps.value)}`;
				},
			},
			{
				Header: 'duration',
				accessor: 'duration',
				Cell: (cellProps: CellProps<any, any>) => {
					return <TimeLeft timeLeft={cellProps.value} />;
				},
			},
			{
				Header: 'fee',
				accessor: 'fee',
				Cell: (cellProps: CellProps<any, any>) => {
					return `${cellProps.value}%`;
				},
			},
			{
				Header: 'status',
				accessor: 'status',
				// eslint-disable-next-line react/display-name
				Cell: (cellProps: CellProps<any, any>) => {
					return <DealStatus status={cellProps.value} />;
				},
			},
		],
		[]
	);
	return (
		<PageLayout title={<>All pools</>} subtitle="">
			<Table
				showPagination={totalPools > MAX_RESULTS_PER_PAGE}
				numPages={Math.ceil(totalPools / MAX_RESULTS_PER_PAGE)}
				noResults={data.length === 0}
				currPage={currPage}
				setPage={setCurrPage}
				data={data}
				columns={columns}
				hasLinksToPool={true}
			/>
		</PageLayout>
	);
};

export default Pools;
