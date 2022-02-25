import { FC, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import BaseModal from 'components/BaseModal';
import Button from 'components/Button';
import GasSelector from 'components/GasSelector';
import { GasLimitEstimate } from 'constants/networks';

type ConfirmTransactionModalProps = {
	title: string;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
	isModalOpen: boolean;
	setGasPrice: Function;
	gasLimitEstimate: GasLimitEstimate;
	onSubmit: Function | undefined;
};

const ConfirmTransactionModal: FC<ConfirmTransactionModalProps> = ({
	title,
	children,
	setIsModalOpen,
	isModalOpen,
	setGasPrice,
	gasLimitEstimate,
	onSubmit,
}) => {
	return (
		<BaseModal title={title} setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen}>
			<ModalContainer>
				{children}
				<GasSelector
					initialGasSpeed="fast"
					setGasPrice={setGasPrice}
					gasLimitEstimate={gasLimitEstimate}
				/>
				<Button
					disabled={!gasLimitEstimate}
					size="md"
					variant="primary"
					type="submit"
					onClick={() => {
						setIsModalOpen(false);
						if (onSubmit) onSubmit();
					}}
				>
					Submit
				</Button>
			</ModalContainer>
		</BaseModal>
	);
};

const ModalContainer = styled.div`
	text-align: center;
`;

export default ConfirmTransactionModal;
