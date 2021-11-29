import { FC, useMemo } from 'react';
import { CellProps } from 'react-table';

import { PageLayout } from 'sections/Layout';
import Table from 'components/Table';
import { Status } from 'components/DealStatus';
import uniqBy from 'lodash/uniqBy';
import Currency from 'components/Currency';
import DealStatus from 'components/DealStatus';
import { formatNumber } from 'utils/numbers';
import useGetPurchasePoolTokensQuery, {
	parsePurchasePoolToken,
} from 'queries/pools/useGetPurchasePoolTokensQuery';
import Connector from 'containers/Connector';

const Pools: FC = () => {
	const { walletAddress } = Connector.useContainer();
	const purchaseTokenQuery = useGetPurchasePoolTokensQuery({ purchaser: walletAddress ?? '' });
	const data = useMemo(
		() =>
			(purchaseTokenQuery?.data ?? []).length > 0
				? uniqBy(purchaseTokenQuery?.data ?? [], 'poolAddress').map(parsePurchasePoolToken)
				: [],
		[purchaseTokenQuery?.data]
	);

	const columns = useMemo(
		() => [
			{
				Header: 'Pool Address',
				accessor: 'poolAddress',
			},
		],
		[]
	);
	return (
		<PageLayout
			title={<>My pools</>}
			subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent neque integer odio dui quisque tellus pellentesque."
		>
			<Table data={data} columns={columns} hasLinksToPool={true} />
		</PageLayout>
	);
};

export default Pools;
