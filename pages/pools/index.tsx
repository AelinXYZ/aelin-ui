//@ts-nocheck
/* eslint-disable react/display-name */
import React from 'react';
import Head from 'next/head';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { CellProps } from 'react-table';
import { FC, useMemo, useState, useEffect } from 'react';

import AddressToEns from 'containers/AddressToEns';

import { PageLayout } from 'sections/Layout';
import FilterPool from 'sections/Pools/FilterPool';

import Table from 'components/Table';
import QuestionMark from 'components/QuestionMark';
import DealStatus from 'components/DealStatus';
import NetworkLogoTable from 'components/NetworkLogoTable';
import { FlexDivStart, FlexDivCol, FlexDivRowCentered } from 'components/common';
import { sortByBn, sortByFee, sortByPrivacy, sortByPurchaseExpiry } from 'components/Table/Table';

import useGetPoolsQuery, { parsePool } from 'queries/pools/useGetPoolsQuery';

import useAddressesToSymbols from 'hooks/useAddressesToSymbols';

import {
	DEFAULT_DECIMALS,
	DEFAULT_PAGE_INDEX,
	DEFAULT_REQUEST_REFRESH_INTERVAL,
} from 'constants/defaults';
import { filterList } from 'constants/poolFilterList';

import { formatNumber } from 'utils/numbers';
import { truncateAddress } from 'utils/crypto';
import { showDateOrMessageIfClosed } from 'utils/time';

import useInterval from 'hooks/useInterval';

const Pools: FC = () => {
	const router = useRouter();

	const { ensNames } = AddressToEns.useContainer();

	const [pools, setPools] = useState([]);

	const [pageIndex, setPageIndex] = useState<number>(
		Number(router.query.page ?? DEFAULT_PAGE_INDEX)
	);

	const poolsQuery = useGetPoolsQuery();

	const poolsQueryWithNetwork = useMemo(() => {
		if (poolsQuery.some((pool) => pool.isLoading)) {
			return [];
		}

		const pools = poolsQuery.reduce((accum, curr) => {
			if (!curr.data) {
				return accum;
			}

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

	const purchaseTokenAddresses = useMemo(
		() =>
			poolsQueryWithNetwork.reduce((accum, curr) => {
				if (filterList.includes(curr.id)) {
					return accum;
				}

				return [...accum, curr.purchaseToken];
			}, []),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[JSON.stringify(poolsQueryWithNetwork)]
	);

	const currencySymbols = useAddressesToSymbols(purchaseTokenAddresses);

	const onFilterChange = (
		sponsorFilter: string,
		currencyFilter: string,
		nameFilter: string,
		statusFilter: string
	) => {
		let pools = poolsQueryWithNetwork
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
			pools = pools.filter(
				(pool) =>
					pool.sponsor.toLowerCase().includes(sponsorFilter.toLowerCase()) ||
					ensNames[pool.sponsor].toLowerCase().includes(sponsorFilter.toLowerCase())
			);
		}

		if (currencyFilter.length) {
			pools = pools.filter(
				(_, index) =>
					(!!currencySymbols.length &&
						currencySymbols[index].toLowerCase().includes(currencyFilter.toLowerCase())) ||
					purchaseTokenAddresses[index].toLowerCase().includes(currencyFilter.toLowerCase())
			);
		}

		if (nameFilter.length) {
			pools = pools.filter(({ name }) => name.toLowerCase().includes(nameFilter.toLowerCase()));
		}

		if (statusFilter) {
			pools = pools.filter(({ poolStatus }) =>
				poolStatus.toLowerCase().includes(statusFilter.toLowerCase())
			);
		}

		setPools(pools);
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

		setPools(list);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(poolsQueryWithNetwork)]);

	const columns = useMemo(
		() => [
			{
				Header: 'Sponsor',
				accessor: 'sponsor',
				Cell: (cellProps: CellProps<any, string>) => {
					const sponsor = ensNames[cellProps.value] ?? cellProps.value;
					return (
						<FlexDivStart>
							{ethers.utils.isAddress(sponsor) ? truncateAddress(sponsor) : sponsor}
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
				width: 125,
				sortable: true,
			},
			{
				Header: 'network',
				accessor: 'network',
				width: 85,
				Cell: (cellProps: CellProps<any, any>) => {
					return (
						<FlexDivStart>
							<NetworkLogoTable networkName={cellProps.value} />
						</FlexDivStart>
					);
				},
				sortable: true,
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
				width: 110,
				sortable: true,
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
				width: 100,
				sortable: true,
				sortType: sortByBn,
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
				width: 100,
				sortable: true,
				sortType: sortByBn,
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
				width: 130,
				sortable: true,
				sortType: sortByPurchaseExpiry,
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
				width: 120,
				sortable: true,
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
				sortable: true,
				sortType: sortByFee,
			},
			{
				Header: 'Privacy',
				accessor: 'hasAllowList',
				Cell: (cellProps: CellProps<any, any>) => {
					return !!cellProps.value ? 'Private' : 'Open';
				},
				width: 75,
				sortable: true,
				sortType: sortByPrivacy,
			},
			{
				Header: 'Stage',
				accessor: 'poolStatus',
				width: 350,
				Cell: (cellProps: CellProps<any, any>) => {
					return <DealStatus status={cellProps.value} />;
				},
				width: 100,
				sortable: true,
			},
		],
		[ensNames]
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
