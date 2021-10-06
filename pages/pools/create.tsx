import { FC, useMemo } from 'react';
import { CellProps } from 'react-table';

import { PageLayout } from 'sections/Layout';
import Table from 'components/Table';
import { Status } from 'components/DealStatus';
import Currency from 'components/Currency';
import DealStatus from 'components/DealStatus';
import { formatNumber } from 'utils/numbers';

const Create: FC = () => {
	return (
		<PageLayout
			title="Create Pool"
			subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent neque integer odio dui quisque tellus pellentesque."
		>
			test
		</PageLayout>
	);
};

export default Create;
