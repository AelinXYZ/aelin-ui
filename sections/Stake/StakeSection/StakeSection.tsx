import { useState, FC } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import { StakeActionLabel } from '../constants';
import StakeBox from '../StakeBox';
import QuestionMark from 'components/QuestionMark';
import { FlexDivCol, FlexDiv } from 'components/common';
import { GasLimitEstimate } from 'constants/networks';
import TransactionData from 'containers/TransactionData';

type StakeSectionProps = {
	header: string;
	tooltipInfo: string;
	token: string;
};

const StakeSection: FC<StakeSectionProps> = ({ header, tooltipInfo, token }) => {
	const [maxValue, setMaxValue] = useState<string>('0');
	const [allowance, setAllowance] = useState<string | null>(null);
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const [stakeAction, setStakeAction] = useState<StakeActionLabel>(StakeActionLabel.DEPOSIT);

	const { txState, setTxState, gasPrice, setGasPrice } = TransactionData.useContainer();

	const amount = 0;
	return (
		<>
			<HeaderSection>
				<Header>{header}</Header>
				<QuestionMark text={tooltipInfo} />
			</HeaderSection>
			<StakeBox
				onSubmit={() => null}
				onApprove={() => null}
				allowance={allowance}
				input={{
					placeholder: '0',
					label: `Balance ${amount} ${token}`,
					maxValue,
					symbol: token,
				}}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasLimitEstimate}
				action={stakeAction}
				setAction={setStakeAction}
			/>
			<RewardsBox>
				<div>{`${amount} AELIN Rewards`}</div>
				<SubmitButton onClick={() => null} variant="text">
					Claim
				</SubmitButton>
			</RewardsBox>
		</>
	);
};

const HeaderSection = styled(FlexDiv)`
	align-items: center;
	margin: 0 0 20px 0;
`;

const Header = styled.h3`
	padding: 20px;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 22px;
	margin: 0;
	padding: 0;
`;

const RewardsBox = styled.div`
	background-color: ${(props) => props.theme.colors.cell};
	text-align: center;
	margin-top: 20px;
	margin-bottom: 20px;
	padding: 20px;
	height: 100px;
	width: 300px;
	position: relative;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
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

export default StakeSection;
