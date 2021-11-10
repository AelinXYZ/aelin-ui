import { CellProps } from 'react-table';
import { FC, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import useGetPoolsQuery, { parsePools } from 'queries/pools/useGetPoolsQuery';
import { PageLayout } from 'sections/Layout';
import FilterPool from 'sections/AelinPool/FilterPool';

import Table from 'components/Table';
import { Status } from 'components/DealStatus';
import Currency from 'components/Currency';
import DealStatus from 'components/DealStatus';
import TimeLeft from 'components/TimeLeft';
import { formatNumber } from 'utils/numbers';
import { truncateAddress } from 'utils/crypto';
import { DEFAULT_REQUEST_REFRESH_INTERVAL, MAX_RESULTS_PER_PAGE } from 'constants/defaults';

const Pools: FC = () => {
	const router = useRouter();
	const [isPageOne, setIsPageOne] = useState<boolean>(true);

	const poolsQuery = useGetPoolsQuery();

	useEffect(() => {
		let timer: ReturnType<typeof setInterval> | null = null;
		if (isPageOne) {
			timer = setInterval(() => {
				poolsQuery.refetch();
			}, DEFAULT_REQUEST_REFRESH_INTERVAL); // every 30s check for new pools
		} else if (timer != null) {
			clearInterval(timer);
		}
		return () => {
			if (timer != null) {
				clearInterval(timer);
			}
		};
	}, [isPageOne, poolsQuery]);

	const pools = useMemo(() => parsePools(poolsQuery?.data), [poolsQuery?.data]);

	const data = useMemo(() => {
		const list = pools.map(
			({
				sponsorFee,
				duration,
				sponsor,
				name,
				address,
				purchaseToken,
				purchaseTokenCap,
				timestamp,
			}) => ({
				sponsor: truncateAddress(sponsor),
				name,
				address: truncateAddress(address),
				purchaseToken: truncateAddress(purchaseToken), // TODO get symbol
				contributions: 1000000, // TODO get contributions
				cap: purchaseTokenCap,
				duration,
				fee: sponsorFee,
				timestamp,
				status: Status.OPEN, // TODO get status
			})
		);
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
	const test = [...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data];
	return (
		<PageLayout title={<>All pools</>} subtitle="">
			<FilterPool
				setSponsor={(sponsor) => console.log(sponsor)}
				setCurrency={(currency) => console.log(currency)}
				setName={(name) => console.log(name)}
				setStatus={(status) => console.log(status)}
			/>
			<Table
				noResultsMessage={poolsQuery.isSuccess && test.length === 0 ? 'no results' : null}
				setIsPageOne={setIsPageOne}
				data={test}
				isLoading={poolsQuery.isLoading}
				columns={columns}
				hasLinksToPool={true}
				showPagination={(test?.length ?? 0) > MAX_RESULTS_PER_PAGE}
			/>
		</PageLayout>
	);
};

export default Pools;
