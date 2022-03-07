import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import { Status } from 'components/DealStatus';
import TextInput from 'components/Input/TextInput';
import { FlexDivRow, FlexDiv } from 'components/common';

import StatusDropdown from 'sections/shared/StatusDropdown';

import ROUTES from 'constants/routes';
interface FilterPoolProps {
	onChange: (
		sponsor: string,
		currency: string,
		name: string,
		status: Status | string | null
	) => void;
}

const FilterPool: FC<FilterPoolProps> = ({ onChange }) => {
	const router = useRouter();

	const [sponsorFilter, setSponsorFilter] = useState<string>('');
	const [currencyFilter, setCurrencyFilter] = useState<string>('');
	const [nameFilter, setNameFilter] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<Status | string | null>(null);

	const [isVisible, setIsVisible] = useState<boolean>(false);

	useEffect(() => {
		// @ts-ignore
		setSponsorFilter(router.query?.sponsorFilter ?? '');
	}, [router.query?.sponsorFilter]);

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
						<Button size="md" isRounded variant="primary">
							Create Pool
						</Button>
					</Link>
				</FlexDiv>
			</HeaderSection>
			{isVisible ? (
				<FlexDivRow>
					<StyledTextInput
						value={sponsorFilter}
						width="22%"
						placeholder="sponsor"
						onChange={(e) => {
							setSponsorFilter(e.target.value);
							onChange(e.target.value, currencyFilter, nameFilter, statusFilter);
						}}
					/>
					<StyledTextInput
						value={currencyFilter}
						width="22%"
						placeholder="currency"
						onChange={(e) => {
							setCurrencyFilter(e.target.value);
							onChange(sponsorFilter, e.target.value, nameFilter, statusFilter);
						}}
					/>
					<StyledTextInput
						value={nameFilter}
						width="22%"
						placeholder="name"
						onChange={(e) => {
							setNameFilter(e.target.value);
							onChange(sponsorFilter, currencyFilter, e.target.value, statusFilter);
						}}
					/>
					<StatusDropdown
						id="statusDropdown"
						name="statusDropdown"
						variant="outline"
						selectedStatus={statusFilter ?? ''}
						onChange={(value) => {
							// @ts-ignore
							setStatusFilter(value);
							// @ts-ignore
							onChange(sponsorFilter, currencyFilter, nameFilter, value);
						}}
					/>
				</FlexDivRow>
			) : null}
		</Container>
	);
};

const Header = styled.div`
	color: ${(props) => props.theme.colors.primary};
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

export default FilterPool;
