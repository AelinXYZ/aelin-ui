import { FC, useState } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import { InputGroup } from 'components/Input/InputGroup';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import TransactionData from 'containers/TransactionData';

import { Container, ErrorNote, ContentContainer } from 'sections/shared/common';

import { GasLimitEstimate } from 'constants/networks';

import { formatNumber } from 'utils/numbers';

interface UnredeemedTokensBoxProps {
	totalAmount: number;
	underlyingSymbol: string;
	underlyingDecimals: number;
	handleSubmit: () => void;
	isButtonDisabled: boolean;
	gasLimitEstimate: GasLimitEstimate;
}

const UnredeemedTokensBox: FC<UnredeemedTokensBoxProps> = ({
	underlyingSymbol,
	underlyingDecimals,
	totalAmount,
	handleSubmit,
	isButtonDisabled,
	gasLimitEstimate,
}) => {
	const { setGasPrice } = TransactionData.useContainer();
	const [showTxModal, setShowTxModal] = useState<boolean>(false);

	return (
		<Container>
			<ContentContainer>
				<Title>Withdraw unredeemed tokens</Title>

				<p>Deal tokens that have been rejected by the purchasers</p>

				<br />

				<Button
					variant="primary"
					size="lg"
					isRounded
					fullWidth
					disabled={isButtonDisabled}
					onClick={() => {
						setShowTxModal(true);
					}}
				>
					Withdraw
				</Button>

				<ConfirmTransactionModal
					title="Confirm Transaction"
					setIsModalOpen={setShowTxModal}
					isModalOpen={showTxModal}
					setGasPrice={setGasPrice}
					gasLimitEstimate={gasLimitEstimate}
					onSubmit={handleSubmit}
				>
					{`Confirm Withdrawal of ${formatNumber(
						totalAmount ?? 0,
						underlyingDecimals
					)} ${underlyingSymbol}`}
				</ConfirmTransactionModal>
			</ContentContainer>
		</Container>
	);
};

const Title = styled.h3`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	font-weight: 400;
`;

export default UnredeemedTokensBox;
