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
import { FlexDivStart, FlexDivCol, FlexDivRowCentered } from 'components/common';
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
import { isMainnet, nameToIdMapping, NetworkId } from 'constants/networks';
import { showDateOrMessageIfClosed } from 'utils/time';
import { Env } from 'constants/env';
import NetworkLogoTable from 'components/NetworkLogoTable';
import styled from 'styled-components';
import { reduce } from 'lodash';

const Pools: FC = () => {
	const router = useRouter();
	const { network } = Connector.useContainer();
	const [pools, setPools] = useState([]);

	const [pageIndex, setPageIndex] = useState<number>(
		Number(router.query.page ?? DEFAULT_PAGE_INDEX)
	);

	const poolsQuery = useGetPoolsQuery();

	const poolsQueryWithNetwork = useMemo(() => {
		if (poolsQuery.some((pool) => pool.isLoading)) return [];

		const pools = poolsQuery.reduce((accum, curr) => {
			if (!curr.data) return accum;

			const poolWithNetworks = curr.data.map((d) => ({ ...d, network: curr.networkName }));

			return [...accum, ...poolWithNetworks];
		}, []);

		return pools.sort((a, b) => b.timestamp - a.timestamp);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(poolsQuery)]);

	const isQueryLoading = poolsQuery.find((q) => q.status === 'loading');

	useEffect(() => {
		setPageIndex(Number(router.query.page ?? DEFAULT_PAGE_INDEX));
	}, [router.query.page]);

	useInterval(() => {
		poolsQuery.forEach((q) => q.refetch());
	}, DEFAULT_REQUEST_REFRESH_INTERVAL);

	const sponsors = useMemo(
		() =>
			poolsQueryWithNetwork.reduce((accum, curr) => {
				if (filterList.includes(curr.id)) return accum;

				return [...accum, curr.sponsor];
			}, []),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[JSON.stringify(poolsQueryWithNetwork)]
	);

	const purchaseTokenAddresses = useMemo(
		() =>
			poolsQueryWithNetwork.reduce((accum, curr) => {
				if (filterList.includes(curr.id)) return accum;

				return [...accum, curr.purchaseToken];
			}, []),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[JSON.stringify(poolsQueryWithNetwork)]
	);

	const ensOrAddresses = useAddressesToEns(sponsors);
	const currencySymbols = useAddressesToSymbols(purchaseTokenAddresses);

	const onFilterChange = (
		sponsorFilter: string,
		currencyFilter: string,
		nameFilter: string,
		statusFilter: string
	) => {
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

		if (statusFilter) {
			list = list.filter(({ poolStatus }) =>
				poolStatus.toLowerCase().includes(statusFilter.toLowerCase())
			);
		}

		setPools(list);
	};

	useEffect(() => {
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

		if (process.env.NODE_ENV === Env.PROD) {
			list = list.filter(({ network }) => isMainnet(nameToIdMapping[network]));
		} else {
			list = list.filter(({ network }) => !isMainnet(nameToIdMapping[network]));
		}

		setPools(list);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(poolsQueryWithNetwork)]);

	const columns = useMemo(
		() => [
			{
				Header: 'Sponsor',
				accessor: 'sponsor',
				Cell: (cellProps: CellProps<any, string>) => {
					return (
						<FlexDivStart>
							<Ens address={cellProps.value} />
						</FlexDivStart>
					);
				},
				width: 150,
			},
			{
				Header: 'Pool name',
				accessor: 'name',
				Cell: (cellProps: CellProps<any, string>) => {
					return <StyledTextWrapper>{cellProps.value}</StyledTextWrapper>;
				},
				width: 115,
			},
			{
				Header: 'network',
				accessor: 'network',
				width: 100,
				Cell: (cellProps: CellProps<any, any>) => {
					return (
						<FlexDivStart>
							<NetworkLogoTable networkName={cellProps.value} />
						</FlexDivStart>
					);
				},
			},
			{
				Header: (
					<FlexDivCol>
						<div>
							Investment <br />
							token
						</div>
					</FlexDivCol>
				),
				accessor: 'purchaseTokenSymbol',
				width: 100,
			},
			{
				Header: (
					<FlexDivCol>
						<div>
							Amount in <br />
							Pool
						</div>
					</FlexDivCol>
				),
				accessor: 'totalSupply',
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
				Header: 'Pool cap',
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
					<FlexDivRowCentered>
						<div>
							Investment <br /> deadline
						</div>
						<QuestionMark
							variant="table-header"
							text={`Timestamps on Optimism will be 10-15 minutes behind the real time for the next few months`}
						/>
					</FlexDivRowCentered>
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
					<FlexDivRowCentered>
						<div>
							Deal
							<br />
							deadline
						</div>
						<QuestionMark
							variant="table-header"
							text={`Timestamps on Optimism will be 10-15 minutes behind the real time for the next few months`}
						/>
					</FlexDivRowCentered>
				),
				accessor: 'poolExpiry',
				Cell: (cellProps: CellProps<any, any>) => {
					return showDateOrMessageIfClosed(cellProps.value, 'Ended');
				},
				width: 125,
			},
			{
				Header: (
					<FlexDivCol>
						<div>
							Sponsor <br />
							fee
						</div>
					</FlexDivCol>
				),
				accessor: 'fee',
				Cell: (cellProps: CellProps<any, any>) => {
					return `${parseFloat(
						Number(ethers.utils.formatEther(cellProps.value.toString())).toFixed(2)
					)}%`;
				},
				width: 85,
			},
			{
				Header: 'Privacy',
				accessor: 'hasAllowList',
				Cell: (cellProps: CellProps<any, any>) => {
					return !!cellProps.value ? 'Private' : 'Open';
				},
				width: 75,
			},
			{
				Header: 'Stage',
				accessor: 'poolStatus',
				width: 350,
				Cell: (cellProps: CellProps<any, any>) => {
					return <DealStatus status={cellProps.value} />;
				},
				width: 100,
			},
		],
		[]
	);

	return (
		<>
			<Head>
				<title>Aelin - Pools</title>
			</Head>

			<PageLayout title={<>All pools</>} subtitle="">
				<FilterPool onChange={onFilterChange} />
				<Table
					pageIndex={pageIndex}
					noResultsMessage={poolsQueryWithNetwork?.length === 0 ? 'no results' : null}
					data={pools && pools.length > 0 ? pools : []}
					isLoading={isQueryLoading}
					columns={columns}
					hasLinksToPool={true}
					showPagination={true}
				/>
			</PageLayout>
		</>
	);
};

const StyledTextWrapper = styled.div`
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100px;
	overflow: hidden;
`;

export default Pools;
