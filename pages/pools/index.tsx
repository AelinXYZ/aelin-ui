//@ts-nocheck
/* eslint-disable react/display-name */
import Head from 'next/head';
import { ethers } from 'ethers';
import { CellProps } from 'react-table';
import { useRouter } from 'next/router';
import { FC, useMemo, useState, useEffect } from 'react';

import Connector from 'containers/Connector';

import { PageLayout } from 'sections/Layout';
import FilterPool from 'sections/Pools/FilterPool';

import Ens from 'components/Ens';
import Table from 'components/Table';
import { FlexDivStart } from 'components/common';
import TokenDisplay from 'components/TokenDisplay';
import DealStatus, { Status } from 'components/DealStatus';
import QuestionMark from 'components/QuestionMark';

import useGetPoolsQuery, { parsePool } from 'queries/pools/useGetPoolsQuery';

import { useAddressesToEns } from 'hooks/useEns';
import useAddressesToSymbols from 'hooks/useAddressesToSymbols';

import {
	DEFAULT_DECIMALS,
	DEFAULT_PAGE_INDEX,
	DEFAULT_REQUEST_REFRESH_INTERVAL,
} from 'constants/defaults';
import { filterList } from 'constants/poolFilterList';

import { formatNumber } from 'utils/numbers';

import useInterval from 'hooks/useInterval';
import { NetworkId } from 'constants/networks';
import { showDateOrMessageIfClosed } from 'utils/time';

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

	const poolsQuery = useGetPoolsQuery();
	const poolsQueryWithNetwork = useMemo(() => {
		return poolsQuery
			.filter((q) => !!q.data)
			.reduce((prev, current) => {
				return [...prev, ...current.data.map((d) => ({ ...d, network: current.networkName }))];
			}, [])
			.sort((a, b) => b.poolStatus.localeCompare(a.poolStatus));
	}, [poolsQuery.map((q) => q.data).filter(Boolean)?.length]);

	const isOptimism = network?.id === NetworkId['Optimism-Mainnet'];

	useEffect(() => {
		setSponsorFilter(router.query?.sponsorFilter ?? '');
	}, [router.query?.sponsorFilter]);

	useEffect(() => {
		setPageIndex(Number(router.query.page ?? DEFAULT_PAGE_INDEX));
	}, [router.query.page]);

	useInterval(() => {
		poolsQuery.forEach((q) => q.refetch());
	}, DEFAULT_REQUEST_REFRESH_INTERVAL);

	const sponsors = useMemo(
		() =>
			poolsQueryWithNetwork
				?.filter(({ id }) => !filterList.includes(id))
				.map(({ sponsor }) => sponsor),
		[poolsQueryWithNetwork?.length]
	);

	const purchaseTokenAddresses = useMemo(
		() =>
			poolsQueryWithNetwork
				.filter(({ id }) => !filterList.includes(id))
				.map(({ purchaseToken }) => purchaseToken),
		[poolsQueryWithNetwork?.length]
	);

	const ensOrAddresses = useAddressesToEns(sponsors);
	const currencySymbols = useAddressesToSymbols(purchaseTokenAddresses);

	const data = useMemo(() => {
		let list = poolsQueryWithNetwork
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
			list = list.filter(
				(_, index) =>
					(!!currencySymbols.length &&
						currencySymbols[index].toLowerCase().includes(currencyFilter.toLowerCase())) ||
					purchaseTokenAddresses[index].toLowerCase().includes(currencyFilter.toLowerCase())
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

		if (process.env.NODE_ENV === 'production') {
			list = list.filter(({ network }) => network === 'mainnet' || network === 'optimism');
		}

		return list;
	}, [
		poolsQueryWithNetwork,
		sponsorFilter,
		currencyFilter,
		nameFilter,
		statusFilter,
		ensOrAddresses,
		sponsors,
		currencySymbols,
		purchaseTokenAddresses,
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
							<TokenDisplay displayAddress={false} symbol={undefined} address={cellProps.value} />
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
				Header: (
					<div>
						Purchase window closes
						{isOptimism && (
							<QuestionMark
								text={`Timestamps on Optimism will be 10-15 minutes behind the real time for the next few months`}
							/>
						)}
					</div>
				),
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
					return showDateOrMessageIfClosed(cellProps.value, 'Ended');
				},
				width: 125,
			},
			{
				Header: (
					<div>
						Pool closes
						{isOptimism && (
							<QuestionMark
								text={`Timestamps on Optimism will be 10-15 minutes behind the real time for the next few months`}
							/>
						)}
					</div>
				),
				accessor: 'poolExpiry',
				Cell: (cellProps: CellProps<any, any>) => {
					return showDateOrMessageIfClosed(cellProps.value, 'Ended');
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
				width: 50,
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
				width: 100,
			},
		],
		[isOptimism]
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
					noResultsMessage={poolsQueryWithNetwork?.length === 0 ? 'no results' : null}
					data={data && data.length > 0 ? data : []}
					isLoading={!poolsQueryWithNetwork?.length}
					columns={columns}
					hasLinksToPool={true}
					showPagination={true}
				/>
			</PageLayout>
		</>
	);
};

export default Pools;
