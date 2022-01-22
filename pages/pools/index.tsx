//@ts-nocheck
/* eslint-disable react/display-name */
import Head from 'next/head';
import { ethers } from 'ethers';
import { CellProps } from 'react-table';
import { useRouter } from 'next/router';
import { FC, useMemo, useState, useEffect } from 'react';

import Connector from 'containers/Connector';

import { PageLayout } from 'sections/Layout';
import FilterPool from 'sections/AelinPool/FilterPool';

import Ens from 'components/Ens';
import Table from 'components/Table';
import Countdown from 'components/Countdown';
import { FlexDivStart } from 'components/common';
import TokenDisplay from 'components/TokenDisplay';
import DealStatus, { Status } from 'components/DealStatus';

import useGetPoolsQuery, { parsePool } from 'queries/pools/useGetPoolsQuery';
import { useAddressesToEns } from 'hooks/useEns';

import {
	DEFAULT_DECIMALS,
	DEFAULT_PAGE_INDEX,
	DEFAULT_REQUEST_REFRESH_INTERVAL,
} from 'constants/defaults';
import { filterList } from 'constants/poolFilterList';

import { formatNumber } from 'utils/numbers';

import useInterval from 'hooks/useInterval';

const Pools: FC = () => {
	const router = useRouter();
	const { network } = Connector.useContainer();

	const [sponsorFilter, setSponsorFilter] = useState<string>('');
	const [currencyFilter, setCurrencyFilter] = useState<string>('');
	const [nameFilter, setNameFilter] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<Status | string | null>(null);
	const [pageIndex, setPageIndex] = useState<number>(
		Number(router.query.page ?? DEFAULT_PAGE_INDEX)
	);

	const poolsQuery = useGetPoolsQuery({ networkId: network.id });

	useEffect(() => {
		setSponsorFilter((router.query?.sponsorFilter ?? '') as string | null);
	}, [router.query?.sponsorFilter]);

	useEffect(() => {
		setPageIndex(Number(router.query.page ?? DEFAULT_PAGE_INDEX));
	}, [router.query.page]);

	useInterval(() => {
		poolsQuery.refetch();
	}, DEFAULT_REQUEST_REFRESH_INTERVAL);

	const sponsors = useMemo(
		() =>
			(poolsQuery?.data ?? [])
				.filter(({ id }) => !filterList.includes(id))
				.map(({ sponsor }) => sponsor),
		[poolsQuery?.data]
	);

	const ensOrAddresses = useAddressesToEns(sponsors);

	const data = useMemo(() => {
		let list = (poolsQuery?.data ?? [])
			.filter(({ id }) => !filterList.includes(id))
			.map(({ sponsorFee, purchaseTokenCap, ...pool }) => {
				const parsedPool = parsePool({
					sponsorFee,
					purchaseTokenCap,
					...pool,
				});

				return {
					...parsedPool,
					fee: sponsorFee,
					cap: purchaseTokenCap,
				};
			});

		if (sponsorFilter.length) {
			list = list.filter(
				(_, index) =>
					(!!ensOrAddresses.length &&
						ensOrAddresses[index].toLowerCase().includes(sponsorFilter.toLowerCase())) ||
					sponsors[index].toLowerCase().includes(sponsorFilter.toLowerCase())
			);
		}

		if (currencyFilter.length) {
			list = list.filter(({ purchaseToken }) =>
				purchaseToken.toLowerCase().includes(currencyFilter.toLowerCase())
			);
		}

		if (nameFilter.length) {
			list = list.filter(({ name }) => name.toLowerCase().includes(nameFilter.toLowerCase()));
		}

		if (statusFilter != null) {
			list = list.filter(({ poolStatus }) =>
				poolStatus.toLowerCase().includes(statusFilter.toLowerCase())
			);
		}

		return list;
	}, [
		poolsQuery?.data,
		sponsorFilter,
		currencyFilter,
		nameFilter,
		statusFilter,
		ensOrAddresses,
		sponsors,
	]);

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
				Header: 'purchase currency',
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
				Header: 'amount funded',
				accessor: 'contributions',
				Cell: (cellProps: CellProps<any, any>) => {
					return (
						<FlexDivStart>
							{formatNumber(
								ethers.utils
									.formatUnits(
										cellProps.value.toString(),
										cellProps.row.original.purchaseTokenDecimals
									)
									.toString(),
								DEFAULT_DECIMALS
							)}
						</FlexDivStart>
					);
				},
				width: 125,
			},
			{
				Header: 'pool cap',
				accessor: 'cap',
				Cell: (cellProps: CellProps<any, any>) => {
					return (
						<FlexDivStart>
							{Number(cellProps.value) === 0
								? 'Uncapped'
								: formatNumber(
										ethers.utils
											.formatUnits(
												cellProps.value.toString(),
												cellProps.row.original.purchaseTokenDecimals
											)
											.toString(),
										DEFAULT_DECIMALS
								  )}
						</FlexDivStart>
					);
				},
				width: 125,
			},
			{
				// TODO update this to be right
				Header: 'Purchase window closes',
				accessor: 'purchaseExpiry',
				Cell: (cellProps: CellProps<any, any>) => {
					if (
						Number(
							ethers.utils
								.formatUnits(
									cellProps.row.original.cap.toString(),
									cellProps.row.original.purchaseTokenDecimals
								)
								.toString()
						) ===
							Number(
								ethers.utils
									.formatUnits(
										cellProps.row.original.contributions.toString(),
										cellProps.row.original.purchaseTokenDecimals
									)
									.toString()
							) &&
						Number(
							ethers.utils
								.formatUnits(
									cellProps.row.original.cap.toString(),
									cellProps.row.original.purchaseTokenDecimals
								)
								.toString()
						) !== 0
					) {
						return <div>Cap Reached</div>;
					}
					return (
						<div>
							<Countdown timeStart={null} time={cellProps.value} networkId={network.id} />
						</div>
					);
				},
				width: 125,
			},
			{
				// TODO update this to be right
				Header: 'Pool duration',
				accessor: 'duration',
				Cell: (cellProps: CellProps<any, any>) => {
					return (
						<Countdown
							timeStart={cellProps.row.original.purchaseExpiry}
							time={cellProps.row.original.purchaseExpiry + cellProps.value}
							networkId={network.id}
						/>
					);
				},
				width: 125,
			},
			{
				Header: 'fee',
				accessor: 'fee',
				Cell: (cellProps: CellProps<any, any>) => {
					return `${parseFloat(
						Number(ethers.utils.formatEther(cellProps.value.toString())).toFixed(2)
					)}%`;
				},
				width: 75,
			},
			{
				Header: 'privacy',
				accessor: 'hasAllowList',
				Cell: (cellProps: CellProps<any, any>) => {
					return !!cellProps.value ? 'Private' : 'Open';
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
		[network.id]
	);

	const filterValues = {
		sponsorFilter,
		currencyFilter,
		nameFilter,
		statusFilter,
	};

	return (
		<>
			<Head>
				<title>Aelin - Pools</title>
			</Head>

			<PageLayout title={<>All pools</>} subtitle="">
				<FilterPool
					values={filterValues}
					setSponsor={setSponsorFilter}
					setCurrency={setCurrencyFilter}
					setName={setNameFilter}
					setStatus={setStatusFilter}
				/>
				<Table
					pageIndex={pageIndex}
					noResultsMessage={poolsQuery.isSuccess && (data?.length ?? 0) === 0 ? 'no results' : null}
					data={data && data.length > 0 ? data : []}
					isLoading={poolsQuery.isLoading}
					columns={columns}
					hasLinksToPool={true}
					showPagination={true}
				/>
			</PageLayout>
		</>
	);
};

export default Pools;
