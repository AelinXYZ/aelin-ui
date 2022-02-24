import { FC } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';

interface ApprovedBoxProps {
	purchaseToken: string;
	handleClick: () => void;
	isButtonDisabled: boolean;
}

const ApprovedBox: FC<ApprovedBoxProps> = ({ handleClick, purchaseToken, isButtonDisabled }) => {
	return (
		<div>
			<Title>Deposit Tokens</Title>
			<p>{`Before you deposit, the pool needs your permission to transfer your ${purchaseToken}`}</p>
			<Button
				variant="primary"
				size="lg"
				isRounded
				disabled={isButtonDisabled}
				onClick={handleClick}
			>
				Approve
			</Button>
		</div>
	);
};

const Title = styled.h3`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	font-weight: 400;
`;

export default ApprovedBox;
