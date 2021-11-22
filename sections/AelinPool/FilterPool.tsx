import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

import { FlexDivRow, FlexDiv } from 'components/common';
import { Status } from 'components/DealStatus';
import TextInput from 'components/Input/TextInput';
import PlusIcon from 'assets/svg/plus.svg';
import Image from 'next/image';
import StatusDropdown from 'sections/shared/StatusDropdown';

interface FilterPoolProps {
	setSponsor: (sponsor: string) => void;
	setCurrency: (currency: string) => void;
	setName: (name: string) => void;
	setStatus: (status: Status | string) => void;
	status: Status | string;
}

const FilterPool: FC<FilterPoolProps> = ({
	setSponsor,
	setCurrency,
	setName,
	setStatus,
	status,
}) => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	return (
		<Container>
			<HeaderSection>
				<Header>Filters</Header>
				<StyledImage onClick={() => setIsVisible(!isVisible)} src={PlusIcon} alt="" />
			</HeaderSection>
			{isVisible ? (
				<FlexDivRow>
					<StyledTextInput
						width="22%"
						placeholder="sponsor"
						onChange={(e) => setSponsor(e.target.value)}
					/>
					<StyledTextInput
						width="22%"
						placeholder="currency"
						onChange={(e) => setCurrency(e.target.value)}
					/>
					<StyledTextInput
						width="22%"
						placeholder="name"
						onChange={(e) => setName(e.target.value)}
					/>
					<StatusDropdown
						id="statusDropdown"
						name="statusDropdown"
						variant="outline"
						selectedStatus={status}
						onChange={setStatus}
					/>
				</FlexDivRow>
			) : null}
		</Container>
	);
};

const Header = styled.div`
	color: ${(props) => props.theme.colors.forestGreen};
	margin-right: 15px;
`;

const Container = styled.div`
	margin-bottom: 15px;
`;

const StyledTextInput = styled(TextInput)`
	border-radius: 8px;
	height: 35px;
`;

const StyledImage = styled(Image)`
	cursor: pointer;
`;

const HeaderSection = styled(FlexDiv)`
	margin-bottom: 10px;
	align-items: center;
`;

export default FilterPool;
