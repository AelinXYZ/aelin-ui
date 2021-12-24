//@ts-nocheck
/* eslint-disable react/display-name */
import Head from 'next/head';
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
import { AELIN_GOV_ADDRESS } from 'constants/token';

import { formatShortDateWithTime } from 'utils/time';
import { formatNumber } from 'utils/numbers';
import Connector from 'containers/Connector';

const Pools: FC = () => {
	const router = useRouter();
	const { network } = Connector.useContainer();
	const [sponsorFilter, setSponsorFilter] = useState<string | null>();
	const [currencyFilter, setCurrencyFilter] = useState<string | null>(null);
	const [nameFilter, setNameFilter] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<Status | string | null>(null);
	const [isPageOne, setIsPageOne] = useState<boolean>(true);

	const poolsQuery = useGetPoolsQuery({ networkId: network.id });

	useEffect(() => {
		setSponsorFilter((router.query?.sponsorFilter ?? AELIN_GOV_ADDRESS) as string | null);
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
		let list = pools
			.filter(
				({ id }) =>
					id !== '0xee9146721a3d9e93d95ba536390008ac0df3c0d6' &&
					id !== '0xb601cecd429fe0eaf424b6d96730ac1c66937e38'
			)
			.map(
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
					hasAllowList,
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
					hasAllowList,
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
								4
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
				Header: 'Purchase window closes',
				accessor: 'purchaseExpiry',
				Cell: (cellProps: CellProps<any, any>) => {
					return <>{formatShortDateWithTime(cellProps.value)}</>;
				},
				width: 125,
			},
			{
				// TODO update this to be right
				Header: 'Pool duration',
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
		[]
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
					noResultsMessage={poolsQuery.isSuccess && (data?.length ?? 0) === 0 ? 'no results' : null}
					setIsPageOne={setIsPageOne}
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
