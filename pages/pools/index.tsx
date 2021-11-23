/* eslint-disable react/display-name */
import { CellProps } from 'react-table';
import { FC, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import useGetPoolsQuery, { parsePool } from 'queries/pools/useGetPoolsQuery';
import { PageLayout } from 'sections/Layout';
import FilterPool from 'sections/AelinPool/FilterPool';

import Table from 'components/Table';
import { FlexDivStart } from 'components/common';
import Currency from 'components/Currency';
import DealStatus, { Status } from 'components/DealStatus';
import TimeLeft from 'components/TimeLeft';
import Ens from 'components/Ens';
import { truncateNumber } from 'utils/numbers';
import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/defaults';

const Pools: FC = () => {
	const router = useRouter();
	const [sponsorFilter, setSponsorFilter] = useState<string | null>(null);
	const [currencyFilter, setCurrencyFilter] = useState<string | null>(null);
	const [nameFilter, setNameFilter] = useState<string | null>(null);
	// TODO implement dropdown
	const [statusFilter, setStatusFilter] = useState<Status | string>(Status.OPEN);
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

	const pools = useMemo(() => (poolsQuery?.data ?? []).map(parsePool), [poolsQuery?.data]);

	const data = useMemo(() => {
		let list = pools.map(
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
				sponsor,
				name,
				address,
				purchaseToken, // TODO get symbol
				contributions: 1000000, // TODO get contributions
				cap: purchaseTokenCap,
				duration,
				fee: sponsorFee,
				timestamp,
				status: Status.OPEN, // TODO get status
			})
		);
		if (router.query.active === 'true') {
			list = list.filter(({ status }) => status === Status.OPEN || status === Status.DEAL);
		}
		if (sponsorFilter != null) {
			list = list.filter(({ sponsor }) =>
				sponsor.toLowerCase().includes(sponsorFilter.toLowerCase())
			);
		}
		if (currencyFilter != null) {
			list = list.filter(({ purchaseToken }) =>
				purchaseToken.toLowerCase().includes(currencyFilter.toLowerCase())
			);
		}
		if (nameFilter != null) {
			list = list.filter(({ name }) => name.toLowerCase().includes(nameFilter.toLowerCase()));
		}
		if (statusFilter != null) {
			list = list.filter(({ status }) => status.toLowerCase().includes(statusFilter.toLowerCase()));
		}
		return list;
	}, [pools, router.query.active, sponsorFilter, currencyFilter, nameFilter, statusFilter]);

	const columns = useMemo(
		() => [
			{
				Header: 'sponsor',
				accessor: 'sponsor',
				Cell: (cellProps: CellProps<any, string>) => {
					return <Ens address={cellProps.value} />;
				},
			},
			{ Header: 'name', accessor: 'name', width: 100 },
			{
				Header: 'purchase token',
				accessor: 'purchaseToken',
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
				setSponsor={setSponsorFilter}
				setCurrency={setCurrencyFilter}
				setName={setNameFilter}
				setStatus={setStatusFilter}
				status={statusFilter}
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
