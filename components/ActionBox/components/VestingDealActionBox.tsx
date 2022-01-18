import { useMemo } from 'react';
import styled from 'styled-components';

import Connector from 'containers/Connector';

import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import { Container, ContentContainer, ActionButton } from './commons';

import { TransactionType } from 'constants/transactions';

const VestingDealActionBox = ({
	maxValue,
	showTxModal,
	setShowTxModal,
	transaction: { txType, setTxType, setGasPrice, gasLimitEstimate, onSubmit },
}: any) => {
	const { walletAddress } = Connector.useContainer();

	const isDisabled: boolean = useMemo(() => {
		return !walletAddress || !maxValue;
	}, [walletAddress, maxValue]);

	const modalContent = useMemo(
		() => ({
			[TransactionType.Vest]: {
				heading: `You are vesting ${maxValue} underlying deal tokens`,
				onSubmit,
			},
		}),
		[maxValue, onSubmit]
	);

	return (
		<Container>
			<ContentContainer>
				<Paragraph>{maxValue || 0} Underlying Deal Tokens to vest</Paragraph>
			</ContentContainer>

			<ActionButton
				disabled={isDisabled}
				isWithdraw={false}
				onClick={() => {
					setTxType(TransactionType.Vest);
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
				onSubmit={modalContent[txType].onSubmit}
			>
				{modalContent[txType].heading}
			</ConfirmTransactionModal>
		</Container>
	);
};

const Paragraph = styled.p`
	color: ${(props) => props.theme.colors.black};
	font-size: 1rem;
`;

export default VestingDealActionBox;
