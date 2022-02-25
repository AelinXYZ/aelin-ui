import { FC } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import TokenDisplay from 'components/TokenDisplay';

interface VestingScheduleBox {
	vestingAmount: number;
	totalVested: number;
	isButtonDisabled: boolean;
	handleClick: () => void;
	underlyingDealToken: string;
}

const VestingScheduleBox: FC<VestingScheduleBox> = ({
	vestingAmount,
	totalVested,
	isButtonDisabled,
	handleClick,
	underlyingDealToken,
}) => {
	return (
		<>
			<Title>Vesting schedule</Title>

			<p>Your deal tokens can be vested</p>

			<p>
				{`Amount to vest: ${vestingAmount}`} <TokenDisplay address={underlyingDealToken} />
			</p>

			<p>
				{`Total vested: ${totalVested}`} <TokenDisplay address={underlyingDealToken} />
			</p>

			<Button
				variant="primary"
				size="lg"
				isRounded
				fullWidth
				disabled={isButtonDisabled}
				onClick={handleClick}
			>
				Vest tokens
			</Button>
		</>
	);
};

const Title = styled.h3`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	font-weight: 400;
`;

export default VestingScheduleBox;
