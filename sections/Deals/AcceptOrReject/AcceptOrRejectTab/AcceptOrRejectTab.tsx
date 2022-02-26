import { FC, ChangeEvent } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import { Status } from 'components/DealStatus';
import { Container, ContentContainer } from 'sections/shared/common';
import { InputGroup } from 'components/Input/InputGroup';

import { TransactionDealType } from 'constants/transactions';

interface AcceptOrRejectTabProps {
	title: string;
	subtitle: string;
	setTxType: (txType: TransactionDealType) => void;
	inputValue: number | string;
	setShowTxModal: (value: boolean) => void;
	userPoolBalance: string | null;
	isButtonDisabled: boolean;
	handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
	dealRedemptionData: any;
	dealRedemptionEnded: any;
	handleMaxButtonClick: () => void;
}

const AcceptOrRejectTab: FC<AcceptOrRejectTabProps> = ({
	title,
	subtitle,
	setTxType,
	inputValue,
	setShowTxModal,
	userPoolBalance,
	isButtonDisabled,
	handleInputChange,
	dealRedemptionData,
	dealRedemptionEnded,
	handleMaxButtonClick,
}) => {
	return (
		<Container>
			<ContentContainer>
				<Header>{title}</Header>
				<p>{subtitle}</p>
				<InputGroup
					type="number"
					placeholder="0"
					value={inputValue}
					disabled={dealRedemptionEnded}
					onChange={handleInputChange}
					max={userPoolBalance ?? undefined}
					icon={
						<div onClick={handleMaxButtonClick}>
							{dealRedemptionData?.status === Status.ProRataRedemption ? 'Max Pro Rata' : 'Max'}
						</div>
					}
				/>
				<ActionBoxInputLabel>
					{`Balance ${Number(userPoolBalance ?? 0)} Pool Tokens`}
				</ActionBoxInputLabel>

				<Button
					variant="primary"
					size="lg"
					fullWidth
					isRounded
					disabled={isButtonDisabled}
					onClick={() => {
						setTxType(TransactionDealType.AcceptDeal);
						setShowTxModal(true);
					}}
				>
					Accept deal
				</Button>
			</ContentContainer>
		</Container>
	);
};

const Header = styled.h3`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	font-weight: 600;
	margin: 0;
	padding: 0;
`;

const ActionBoxInputLabel = styled.p`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1rem;
	margin-top: 7.5px;
	padding-bottom: 4px;
`;

export default AcceptOrRejectTab;
