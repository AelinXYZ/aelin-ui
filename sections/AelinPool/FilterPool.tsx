import { FC } from 'react';

import { FlexDivRow } from 'components/common';
import { Status } from 'components/DealStatus';
import TextInput from 'components/Input/TextInput';

interface FilterPoolProps {
	setSponsor: (sponsor: string) => void;
	setCurrency: (currency: string) => void;
	setName: (name: string) => void;
	setStatus: (status: Status) => void;
}

const FilterPool: FC<FilterPoolProps> = ({ setSponsor, setCurrency, setName, setStatus }) => {
	return (
		<FlexDivRow>
			<TextInput placeholder="sponsor" onChange={(e) => setSponsor(e.target.value)} />
			<TextInput placeholder="currency" onChange={(e) => setCurrency(e.target.value)} />
			<TextInput placeholder="name" onChange={(e) => setName(e.target.value)} />
			<TextInput placeholder="status" onChange={(e) => setStatus(e.target.value)} />
		</FlexDivRow>
	);
};

export default FilterPool;
