import { FC, useMemo, useState } from 'react';
import styled from 'styled-components';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';

import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import { Container, ContentContainer, ActionButton } from '../../../shared/common';

import { GasLimitEstimate } from 'constants/networks';

interface VestingDealProps {
	vestingAmount: number;
	onSubmit: Function;
	gasLimitEstimate: GasLimitEstimate;
}

const VestingDealBox: FC<VestingDealProps> = ({ vestingAmount, onSubmit, gasLimitEstimate }) => {
	const { walletAddress } = Connector.useContainer();
	const { setGasPrice } = TransactionData.useContainer();

	const [showTxModal, setShowTxModal] = useState(false);

	const isButtonDisabled: boolean = useMemo(() => {
		return !walletAddress || !vestingAmount;
	}, [walletAddress, vestingAmount]);

	return (
		<Container>
			<ContentContainer>
				<Paragraph>{vestingAmount || 0} Underlying Deal Tokens to vest</Paragraph>
			</ContentContainer>

			<ActionButton
				disabled={isButtonDisabled}
				isWithdraw={false}
				onClick={() => {
					setShowTxModal(true);
				}}
			>
				Vest Deal
			</ActionButton>

			<ConfirmTransactionModal
				title="Confirm Transaction"
				setIsModalOpen={setShowTxModal}
				isModalOpen={showTxModal}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasLimitEstimate}
				onSubmit={onSubmit}
			>
				{`You are vesting ${vestingAmount} underlying deal tokens`}
			</ConfirmTransactionModal>
		</Container>
	);
};

const Paragraph = styled.p`
	color: ${(props) => props.theme.colors.black};
	font-size: 1rem;
`;

export default VestingDealBox;
