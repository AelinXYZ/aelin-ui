import { CellProps } from 'react-table';
import { FC, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import useGetPoolsQuery, { parsePools } from 'queries/pools/useGetPoolsQuery';
import { PageLayout } from 'sections/Layout';
import FilterPool from 'sections/AelinPool/FilterPool';

import Table from 'components/Table';
import { Status } from 'components/DealStatus';
import { FlexDivStart } from 'components/common';
import Currency from 'components/Currency';
import DealStatus from 'components/DealStatus';
import TimeLeft from 'components/TimeLeft';
import { truncateNumber } from 'utils/numbers';
import { truncateAddress } from 'utils/crypto';
import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/defaults';

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
			{
				Header: 'sponsor',
				accessor: 'sponsor',
				Cell: (cellProps: CellProps<any, any>) => {
					return <>{truncateAddress(cellProps.value)}</>;
				},
			},
			{ Header: 'name', accessor: 'name', width: 100 },
			{
				Header: 'purchase token',
				accessor: 'purchaseToken',
				// eslint-disable-next-line react/display-name
				Cell: (cellProps: CellProps<any, any>) => {
					return (
						<FlexDivStart>
							<Currency ticker={cellProps.value} />
						</FlexDivStart>
					);
				},
			},
			{
				Header: 'contributions',
				accessor: 'contributions',
				Cell: (cellProps: CellProps<any, any>) => {
					return <FlexDivStart>{truncateNumber(cellProps.value)}</FlexDivStart>;
				},
				width: 125,
			},
			{
				Header: 'cap',
				accessor: 'cap',
				Cell: (cellProps: CellProps<any, any>) => {
					return <FlexDivStart>{truncateNumber(cellProps.value)}</FlexDivStart>;
				},
				width: 125,
			},
			{
				Header: 'duration',
				accessor: 'duration',
				Cell: (cellProps: CellProps<any, any>) => {
					return <TimeLeft timeLeft={cellProps.value} />;
				},
				width: 125,
			},
			{
				Header: 'fee',
				accessor: 'fee',
				Cell: (cellProps: CellProps<any, any>) => {
					return `${cellProps.value}%`;
				},
				width: 75,
			},
			{
				Header: 'status',
				accessor: 'status',
				// eslint-disable-next-line react/display-name
				Cell: (cellProps: CellProps<any, any>) => {
					return <DealStatus status={cellProps.value} />;
				},
				width: 75,
			},
		],
		[]
	);

	return (
		<PageLayout title={<>All pools</>} subtitle="">
			<FilterPool
				setSponsor={(sponsor) => console.log(sponsor)}
				setCurrency={(currency) => console.log(currency)}
				setName={(name) => console.log(name)}
				setStatus={(status) => console.log(status)}
			/>
			<Table
				noResultsMessage={poolsQuery.isSuccess && (data?.length ?? 0) === 0 ? 'no results' : null}
				setIsPageOne={setIsPageOne}
				data={data && data.length > 0 ? data : []}
				isLoading={poolsQuery.isLoading}
				columns={columns}
				hasLinksToPool={true}
				showPagination={true}
			/>
		</PageLayout>
	);
};

export default Pools;
