//@ts-nocheck
/* eslint-disable react/display-name */
import { ethers } from 'ethers';
import { CellProps } from 'react-table';
import { useRouter } from 'next/router';
import { FC, useMemo, useState, useEffect } from 'react';

import { PageLayout } from 'sections/Layout';
import FilterPool from 'sections/AelinPool/FilterPool';

import Ens from 'components/Ens';
import Table from 'components/Table';
import { FlexDivStart } from 'components/common';
import TokenDisplay from 'components/TokenDisplay';
import DealStatus, { Status } from 'components/DealStatus';

import useGetPoolsQuery, { parsePool } from 'queries/pools/useGetPoolsQuery';

import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/defaults';

import { formatShortDateWithTime } from 'utils/time';

const Pools: FC = () => {
	const router = useRouter();
	const [sponsorFilter, setSponsorFilter] = useState<string | null>(null);
	const [currencyFilter, setCurrencyFilter] = useState<string | null>(null);
	const [nameFilter, setNameFilter] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<Status | string | null>(null);
	const [isPageOne, setIsPageOne] = useState<boolean>(true);

	const poolsQuery = useGetPoolsQuery();

	useEffect(() => {
		setSponsorFilter((router.query?.sponsorFilter ?? null) as string | null);
	}, [router.query?.sponsorFilter]);

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
				id,
				purchaseToken,
				contributions,
				purchaseTokenCap,
				purchaseTokenDecimals,
				timestamp,
				purchaseExpiry,
				poolStatus,
			}) => ({
				sponsor,
				name,
				id,
				purchaseToken,
				contributions,
				cap: purchaseTokenCap,
				purchaseTokenDecimals,
				duration,
				fee: sponsorFee,
				purchaseExpiry,
				timestamp,
				poolStatus,
			})
		);

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
			list = list.filter(({ poolStatus }) =>
				poolStatus.toLowerCase().includes(statusFilter.toLowerCase())
			);
		}
		return list;
	}, [pools, sponsorFilter, currencyFilter, nameFilter, statusFilter]);

	const columns = useMemo(
		() => [
			{
				Header: 'sponsor',
				accessor: 'sponsor',
				Cell: (cellProps: CellProps<any, string>) => {
					return (
						<FlexDivStart>
							<Ens address={cellProps.value} />
						</FlexDivStart>
					);
				},
			},
			{ Header: 'name', accessor: 'name', width: 100 },
			{
				Header: 'purchase token',
				accessor: 'purchaseToken',
				Cell: (cellProps: CellProps<any, any>) => {
					return (
						<FlexDivStart>
							<TokenDisplay displayAddress={true} symbol={undefined} address={cellProps.value} />
						</FlexDivStart>
					);
				},
			},
			{
				Header: 'contributions',
				accessor: 'contributions',
				Cell: (cellProps: CellProps<any, any>) => {
					return (
						<FlexDivStart>
							{ethers.utils
								.formatUnits(
									cellProps.value.toString(),
									cellProps.row.original.purchaseTokenDecimals
								)
								.toString()}
						</FlexDivStart>
					);
				},
				width: 125,
			},
			{
				Header: 'cap',
				accessor: 'cap',
				Cell: (cellProps: CellProps<any, any>) => {
					return (
						<FlexDivStart>
							{Number(cellProps.value) === 0
								? 'Uncapped'
								: ethers.utils
										.formatUnits(
											cellProps.value.toString(),
											cellProps.row.original.purchaseTokenDecimals
										)
										.toString()}
						</FlexDivStart>
					);
				},
				width: 125,
			},
			{
				// TODO update this to be right
				Header: 'Purchase ends',
				accessor: 'purchaseExpiry',
				Cell: (cellProps: CellProps<any, any>) => {
					return <>{formatShortDateWithTime(cellProps.value)}</>;
				},
				width: 125,
			},
			{
				// TODO update this to be right
				Header: 'Pool unlocks',
				accessor: 'duration',
				Cell: (cellProps: CellProps<any, any>) => {
					return (
						<>{formatShortDateWithTime(cellProps.row.original.purchaseExpiry + cellProps.value)}</>
					);
				},
				width: 125,
			},
			{
				Header: 'fee',
				accessor: 'fee',
				Cell: (cellProps: CellProps<any, any>) => {
					return `${Number(ethers.utils.formatEther(cellProps.value.toString()))}%`;
				},
				width: 75,
			},
			{
				Header: 'status',
				accessor: 'poolStatus',
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
