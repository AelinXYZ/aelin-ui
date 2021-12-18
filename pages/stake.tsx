//@ts-nocheck
import { useState } from 'react';
import styled from 'styled-components';

import { PageLayout } from 'sections/Layout';
import TransactionData from 'containers/TransactionData';
import Button from 'components/Button';
import ActionBox, { ActionBoxType } from 'components/ActionBox';
import { GasLimitEstimate } from 'constants/networks';

const Stake = () => {
	const [allowance, setAllowance] = useState<string | null>(null);
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);
	const [maxValue, setMaxValue] = useState<string>('0');
	const {
		txState,
		setTxState,
		gasPrice,
		setGasPrice,
		setTxType,
		txType,
	} = TransactionData.useContainer();
	const handleApprove = () => {
		console.log('approve');
	};
	const handleSubmit = () => {
		console.log('submit');
	};

	return (
		<PageLayout title={<>Stake Your Balancer LP tokens</>} subtitle="">
			<Layout>
				<Section style={{ textAlign: 'center' }}>
					<Header>Provide liquidity into the DEFI pool on Balancer to earn AELIN</Header>
					<SubmitButton
						onClick={() => window.open('https://app.balancer.fi/', 'blank')}
						variant="text"
					>
						Go to Balancer
					</SubmitButton>
				</Section>
				<ActionBox
					onSubmit={handleSubmit}
					actionBoxType={ActionBoxType.Stake}
					onApprove={handleApprove}
					allowance={allowance}
					input={{
						placeholder: '0',
						label: `Balance 0 Balancer LP`,

						maxValue,
						symbol: 'Balancer LP',
					}}
					txState={txState}
					setTxState={setTxState}
					setGasPrice={setGasPrice}
					gasLimitEstimate={gasLimitEstimate}
					txType={txType}
					setTxType={setTxType}
				/>
			</Layout>
		</PageLayout>
	);
};

const Header = styled.h3`
	padding: 20px;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 14px;
	margin: 0;
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
	height: 300px;
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

export default Stake;
