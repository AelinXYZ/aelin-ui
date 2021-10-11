import { FC, useMemo } from 'react';
import { CellProps } from 'react-table';

import { PageLayout } from 'sections/Layout';
import Table from 'components/Table';
import { Status } from 'components/DealStatus';
import Currency from 'components/Currency';
import DealStatus from 'components/DealStatus';
import { formatNumber } from 'utils/numbers';

const Pools: FC = () => {
	const data = useMemo(
		() => [
			{
				sponsor: 'Synthetix',
				name: 'Kwenta token',
				address: '0x4069e799Da927C06b430e247b2ee16C03e8B837d',
				currency: 'sUSD',
				contributions: 1000000,
				cap: 10000000,
				duration: '5 weeks',
				fee: 0.001,
				status: Status.OPEN,
			},
			{
				sponsor: 'Synthetix',
				name: 'Kwenta token',
				address: '0x4069e799Da927C06b430e247b2ee16C03e8B837d',
				currency: 'USDT',
				contributions: 1000000,
				cap: 10000000,
				duration: '5 weeks',
				fee: 0.001,
				status: Status.DEAL,
			},
			{
				sponsor: 'Synthetix',
				name: 'Kwenta token',
				address: '0x1234',
				currency: 'sUSD',
				contributions: 1000000,
				cap: 10000000,
				duration: '2 months',
				fee: 0.001,
				status: Status.EXPIRED,
			},
			{
				sponsor: 'Synthetix',
				name: 'Kwenta token',
				currency: 'USDC',
				contributions: 1000000,
				cap: 10000000,
				duration: '5 weeks',
				fee: 0.001,
				status: Status.REJECTED,
			},
			{
				sponsor: 'Synthetix',
				name: 'Kwenta token',
				currency: 'USDC',
				contributions: 1000000,
				cap: 10000000,
				duration: '20 weeks',
				fee: 0.001,
				status: Status.OPEN,
			},
		],
		[]
	);

	const columns = useMemo(
		() => [
			{ Header: 'sponsor', accessor: 'sponsor' },
			{ Header: 'name', accessor: 'name' },
			{
				Header: 'currency',
				accessor: 'currency',
				// eslint-disable-next-line react/display-name
				Cell: (cellProps: CellProps<any, any>) => {
					return <Currency ticker={cellProps.value} />;
				},
			},
			{
				Header: 'contributions',
				accessor: 'contributions',
				Cell: (cellProps: CellProps<any, any>) => {
					return `$${formatNumber(cellProps.value)}`;
				},
			},
			{
				Header: 'cap',
				accessor: 'cap',
				Cell: (cellProps: CellProps<any, any>) => {
					return `$${formatNumber(cellProps.value)}`;
				},
			},
			{
				Header: 'duration',
				accessor: 'duration',
			},
			{
				Header: 'fee',
				accessor: 'fee',
				Cell: (cellProps: CellProps<any, any>) => {
					return `${100 * cellProps.value}%`;
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
		<PageLayout
			title={<>My Sponsored Pools</>}
			subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent neque integer odio dui quisque tellus pellentesque."
		>
			<Table data={data} columns={columns} hasLinksToPool={true} />
		</PageLayout>
	);
};

export default Pools;
