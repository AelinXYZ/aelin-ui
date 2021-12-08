import styled from 'styled-components';

import { PageLayout } from 'sections/Layout';
import Button from 'components/Button';
import ActionBox, { ActionBoxType } from 'components/ActionBox';

const Stake = () => {
	const handleSubmit = () => {
		console.log('submit');
	};

	return (
		<PageLayout title={<>Stake Your Balancer LP tokens</>} subtitle="">
			<Layout>
				<Section>
					<Header>Provide liquidity into the DEFI pool on Balancer to earn AELIN</Header>
					<SubmitButton variant="text">Go to Balancer</SubmitButton>
				</Section>
				<Section>
					<ActionBox
						actionBoxType={actionBoxType}
						onApprove={onApprove}
						allowance={allowance}
						onSubmit={onSubmit}
						dealRedemptionData={dealRedemptionData}
						input={input}
						txState={txState}
						setTxState={setTxState}
						isPurchaseExpired={isPurchaseExpired}
						setGasPrice={setGasPrice}
						gasLimitEstimate={gasLimitEstimate}
						privatePoolDetails={privatePoolDetails}
					/>
				</Section>
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

const Section = styled.div``;

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
