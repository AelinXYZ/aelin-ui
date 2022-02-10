//@ts-nocheck
import Link from 'next/link';
import { FC, useState } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import { Status } from 'components/DealStatus';
import TextInput from 'components/Input/TextInput';
import { FlexDivRow, FlexDiv } from 'components/common';

import StatusDropdown from 'sections/shared/StatusDropdown';

import ROUTES from 'constants/routes';

interface FilterPoolProps {
	values: any;
	setSponsor: (sponsor: string) => void;
	setCurrency: (currency: string) => void;
	setName: (name: string) => void;
	setStatus: (status: Status | string) => void;
}

const FilterPool: FC<FilterPoolProps> = ({
	values,
	setSponsor,
	setCurrency,
	setName,
	setStatus,
}) => {
	const { sponsorFilter, currencyFilter, nameFilter, statusFilter } = values;
	const [isVisible, setIsVisible] = useState<boolean>(false);
	return (
		<Container>
			<HeaderSection>
				<FlexDiv>
					<Button size="lg" variant="tertiary" onClick={() => setIsVisible(!isVisible)}>
						<Header>
							Filters
							<Plus>+</Plus>
						</Header>
					</Button>
				</FlexDiv>
				<FlexDiv>
					<Link href={ROUTES.Pools.Create} passHref>
						<StyledAnchor>Create Pool</StyledAnchor>
					</Link>
				</FlexDiv>
			</HeaderSection>
			{isVisible ? (
				<FlexDivRow>
					<StyledTextInput
						value={sponsorFilter}
						width="22%"
						placeholder="sponsor"
						onChange={(e) => setSponsor(e.target.value)}
					/>
					<StyledTextInput
						value={currencyFilter}
						width="22%"
						placeholder="currency"
						onChange={(e) => setCurrency(e.target.value)}
					/>
					<StyledTextInput
						value={nameFilter}
						width="22%"
						placeholder="name"
						onChange={(e) => setName(e.target.value)}
					/>
					<StatusDropdown
						id="statusDropdown"
						name="statusDropdown"
						variant="outline"
						selectedStatus={statusFilter}
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
	font-size: 1.3rem;
	font-weight: 400;
	display: flex;
`;

const Plus = styled.span`
	font-size: 1.8rem;
	margin-left: 0.5rem;
`;

const Container = styled.div`
	margin-bottom: 15px;
`;

const StyledTextInput = styled(TextInput)`
	border-radius: 8px;
	height: 35px;
`;

const HeaderSection = styled(FlexDiv)`
	margin-bottom: 10px;
	align-items: center;
	justify-content: space-between;
`;

const StyledAnchor = styled.a`
	height: 32px;
	line-height: 32px;
	font-size: 1rem;
	padding: 0 12px;
	font-family: ${(props) => props.theme.fonts.ASMRegular};
	background-color: ${(props) => props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
	width: 140px;
	border-radius: 4px;
	cursor: pointer;
	text-align: center;
`;

export default FilterPool;
