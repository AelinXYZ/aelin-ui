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
				<StyledHr />
				<GasSelector
					initialGasSpeed="fast"
					setGasPrice={setGasPrice}
					gasLimitEstimate={gasLimitEstimate}
				/>
				<StyledButton
					disabled={!gasLimitEstimate}
					size="md"
					variant="primary"
					type="submit"
					isRounded
					onClick={() => {
						setIsModalOpen(false);
						if (onSubmit) {onSubmit();}
					}}
				>
					Submit
				</StyledButton>
			</ModalContainer>
		</BaseModal>
	);
};

const ModalContainer = styled.div`
	text-align: center;
`;

const StyledButton = styled(Button)`
	font-family: ${(props) => props.theme.fonts.agrandir};
	padding: 0 45px;
`;

const StyledHr = styled.hr`
	background-color: rgba(0, 0, 0, 0.5);
`;

export default ConfirmTransactionModal;
