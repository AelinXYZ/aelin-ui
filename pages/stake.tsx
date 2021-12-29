//@ts-nocheck
import Head from 'next/head';
import { useState } from 'react';
import styled from 'styled-components';

import { PageLayout } from 'sections/Layout';
import TransactionData from 'containers/TransactionData';
import Button from 'components/Button';
import QuestionMark from 'components/QuestionMark';
import ActionBox, { ActionBoxType } from 'components/ActionBox';
import { GasLimitEstimate } from 'constants/networks';
import { FlexDivCol, FlexDiv } from 'components/common';

const Stake = () => {
	const [allowance, setAllowance] = useState<string | null>(null);
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const [maxValue, setMaxValue] = useState<string>('0');
	const { txState, setTxState, gasPrice, setGasPrice, setTxType, txType } =
		TransactionData.useContainer();
	const handleApproveAelin = () => {
		console.log('approve');
	};
	const handleApproveAelinETH = () => {
		console.log('approve');
	};
	const handleSubmitAelin = () => {
		console.log('submit');
	};
	const handleSubmitAelinETH = () => {
		console.log('submit');
	};
	const handleClaimAelin = () => {
		console.log('submit');
	};
	const handleClaimAelinETH = () => {
		console.log('submit');
	};
	const amount = 0;

	return (
		<>
			<Head>
				<title>Aelin - Stake</title>
			</Head>

			<PageLayout title={<>Stake $AELIN or $AELIN-$ETH LP tokens</>} subtitle="">
				<JustifiedLayout>
					<PageSection>
						<FlexDiv>
							<Header>$AELIN staking</Header>
							<QuestionMark
								text="Staking $AELIN gives a share of 29 AELIN/month in inflationary rewards + 2/3 of
							protocol deal fees. Note deal fees are temporarily custodied by the Aelin Council and
							will be distributed in the future."
							/>
						</FlexDiv>
						<ActionBox
							onSubmit={handleSubmitAelin}
							actionBoxType={ActionBoxType.Stake}
							onApprove={handleApproveAelin}
							allowance={allowance}
							input={{
								placeholder: '0',
								label: `Balance ${amount} AELIN`,
								maxValue,
								symbol: 'AELIN',
							}}
							txState={txState}
							setTxState={setTxState}
							setGasPrice={setGasPrice}
							gasLimitEstimate={gasLimitEstimate}
							txType={txType}
							setTxType={setTxType}
						/>
						<RewardsBox>
							<div>{`${amount} AELIN Rewards`}</div>
							<SubmitButton onClick={handleClaimAelin} variant="text">
								Claim
							</SubmitButton>
						</RewardsBox>
					</PageSection>
					<PageSection>
						<FlexDiv>
							<Header>$AELIN/$ETH staking</Header>
							<QuestionMark
								text="Staking $AELIN/$ETH LP gives a share of 44 AELIN/month in inflationary rewards + 1/3
							of deal fees. Note deal fees are temporarily custodied by the Aelin Council and will
							be distributed in the future."
							/>
						</FlexDiv>
						<ActionBox
							onSubmit={handleSubmitAelinETH}
							actionBoxType={ActionBoxType.Stake}
							onApprove={handleApproveAelinETH}
							allowance={allowance}
							input={{
								placeholder: '0',
								label: `Balance ${amount} AELIN/ETH LP`,
								maxValue,
								symbol: 'AELIN/ETH LP',
							}}
							txState={txState}
							setTxState={setTxState}
							setGasPrice={setGasPrice}
							gasLimitEstimate={gasLimitEstimate}
							txType={txType}
							setTxType={setTxType}
						/>
						<RewardsBox>
							<div>{`${amount} AELIN Rewards`}</div>
							<SubmitButton onClick={handleClaimAelinETH} variant="text">
								Claim
							</SubmitButton>
						</RewardsBox>
						<Section>
							<Text>
								To obtain $AELIN/$ETH LP tokens, first provide liquidity into the $AELIN/$ETH pool
								on Uniswap
							</Text>
							<SubmitButton
								onClick={() => window.open('https://app.uniswap.org/', 'blank')}
								variant="text"
							>
								Go to Uniswap
							</SubmitButton>
						</Section>
					</PageSection>
				</JustifiedLayout>
			</PageLayout>
		</>
	);
};

const Header = styled.h3`
	padding: 20px;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 22px;
	margin: 0 10px 20px 0;
	padding: 0;
`;

const Text = styled.h3`
	padding: 20px;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 14px;
	margin: 20px 0;
	padding: 0;
`;

const Layout = styled.div`
	margin-top: 50px;
	justify-content: center;
	display: flex;
`;

const Section = styled.div`
	margin-right: 40px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100px;
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

const PageSection = styled(FlexDivCol)`
	width: 30%;
	height: 600px;
`;

const JustifiedLayout = styled(Layout)`
	justify-content: space-around;
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

export default Stake;
