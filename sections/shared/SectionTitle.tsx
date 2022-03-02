import { FC } from 'react';

import EtherscanLink from 'components/EtherscanLink';
import { FlexDivCenterAligned } from 'components/common';
interface SectionTitleProps {
	address: string | null;
	title: string;
}

const SectionTitle: FC<SectionTitleProps> = ({ address, title }) => {
	return (
		<FlexDivCenterAligned>
			{title}
			{address && <EtherscanLink address={address} />}
		</FlexDivCenterAligned>
	);
};

export default SectionTitle;
