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
				<hr />
				<GasSelector
					initialGasSpeed="fast"
					setGasPrice={setGasPrice}
					gasLimitEstimate={gasLimitEstimate}
				/>
				<SubmitButton
					disabled={!gasLimitEstimate}
					variant="text"
					type="submit"
					onClick={() => {
						setIsModalOpen(false);
						if (onSubmit) onSubmit();
					}}
				>
					Submit
				</SubmitButton>
			</ModalContainer>
		</BaseModal>
	);
};

const ModalContainer = styled.div`
	text-align: center;
`;

const SubmitButton = styled(Button)`
	background-color: ${(props) => props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
	width: 120px;
	margin: 10px auto 0 auto;
	&:hover {
		&:not(:disabled) {
			color: ${(props) => props.theme.colors.white};
			box-shadow: 0px 0px 10px rgba(71, 120, 48, 0.8);
		}
	}
`;

export default ConfirmTransactionModal;
