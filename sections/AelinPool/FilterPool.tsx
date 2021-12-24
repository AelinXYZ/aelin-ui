//@ts-nocheck
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { FlexDivRow, FlexDiv } from 'components/common';
import { Status } from 'components/DealStatus';
import TextInput from 'components/Input/TextInput';
import PlusIcon from 'assets/svg/plus.svg';
import Image from 'next/image';
import StatusDropdown from 'sections/shared/StatusDropdown';
import ROUTES from 'constants/routes';
import Button from 'components/Button';

interface FilterPoolProps {
	values: {
		sponsorFilter: string;
		currencyFilter: string;
		nameFilter: string;
		statusFilter: Status | string | null;
	};
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
	const [isViewAllButtonDisabled, setViewAllButtonDisabled] = useState<boolean>(false);

	const clearFilters = () => {
		setSponsor('');
		setCurrency('');
		setName('');
		setStatus('');
		setViewAllButtonDisabled(true);
	};

	const [isVisible, setIsVisible] = useState<boolean>(false);
	return (
		<Container>
			<HeaderSection>
				<FlexDiv>
					<Header>Filters</Header>
					<StyledImage onClick={() => setIsVisible(!isVisible)} src={PlusIcon} alt="" />
				</FlexDiv>
				<FlexDiv>
					<ButtonContainer>
						{!isViewAllButtonDisabled && (
							<Button variant="text" onClick={clearFilters}>
								View All Pools
							</Button>
						)}
					</ButtonContainer>
					<Link href={ROUTES.Pools.Create} passHref>
						<StyledAnchor>Create Pool</StyledAnchor>
					</Link>
				</FlexDiv>
			</HeaderSection>
			{isVisible ? (
				<FlexDivRow>
					<StyledTextInput
						width="22%"
						placeholder="sponsor"
						value={sponsorFilter}
						onChange={(e) => {
							setSponsor(e.target.value);
							if (!e.target.value.length) return;
							setViewAllButtonDisabled(false);
						}}
					/>
					<StyledTextInput
						width="22%"
						placeholder="currency"
						value={currencyFilter}
						onChange={(e) => {
							setCurrency(e.target.value);
							if (!e.target.value.length) return;
							setViewAllButtonDisabled(false);
						}}
					/>
					<StyledTextInput
						width="22%"
						placeholder="name"
						value={nameFilter}
						onChange={(e) => {
							setName(e.target.value);
							if (!e.target.value.length) return;
							setViewAllButtonDisabled(false);
						}}
					/>
					<StatusDropdown
						id="statusDropdown"
						name="statusDropdown"
						variant="outline"
						selectedStatus={statusFilter}
						onChange={(value) => {
							setStatus(value);
							if (!value) return;
							setViewAllButtonDisabled(false);
						}}
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
	justify-content: space-between;
`;

const ButtonContainer = styled.div`
	width: 150px;
	display: flex;
	justify-content: space-between;
`;

const StyledAnchor = styled.a`
	height: 32px;
	line-height: 32px;
	font-size: 12px;
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
