import { FC, useMemo, useState } from 'react';
import styled from 'styled-components';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';

import TokenDisplay from 'components/TokenDisplay';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import { Container, ContentContainer } from 'sections/shared/common';

import { GasLimitEstimate } from 'constants/networks';

import VestingCliffBox from './VestingCliffBox';
import VestingScheduleBox from './VestingScheduleBox';
import AllVestedBox from './AllVestedBox';

interface VestingDealProps {
	onSubmit: () => void;
	totalVested: number | null;
	vestingAmount: number;
	gasLimitEstimate: GasLimitEstimate;
	isVestingCliffEnds: boolean;
	isVestingPeriodEnds: boolean;
	underlyingDealToken: string;
}

const VestingDealBox: FC<VestingDealProps> = ({
	onSubmit,
	totalVested,
	vestingAmount,
	gasLimitEstimate,
	isVestingCliffEnds,
	isVestingPeriodEnds,
	underlyingDealToken,
}) => {
	const { walletAddress } = Connector.useContainer();
	const { setGasPrice } = TransactionData.useContainer();

	const [showTxModal, setShowTxModal] = useState(false);

	const isButtonDisabled: boolean = useMemo(() => {
		return !walletAddress || !vestingAmount;
	}, [walletAddress, vestingAmount]);

	const isAllVested = vestingAmount === 0;

	const handleVestClick = () => {
		setShowTxModal(true);
	};

	return (
		<Container>
			<ContentContainer>
				{!isVestingCliffEnds && <VestingCliffBox />}
				{isVestingCliffEnds && !isAllVested && (
					<>
						<VestingScheduleBox
							vestingAmount={vestingAmount}
							totalVested={totalVested}
							isButtonDisabled={isButtonDisabled}
							underlyingDealToken={underlyingDealToken}
							handleClick={handleVestClick}
						/>
						<ConfirmTransactionModal
							title="Confirm Transaction"
							setIsModalOpen={setShowTxModal}
							isModalOpen={showTxModal}
							setGasPrice={setGasPrice}
							gasLimitEstimate={gasLimitEstimate}
							onSubmit={onSubmit}
						>
							{`You are vesting ${vestingAmount}`} <TokenDisplay address={underlyingDealToken} />
						</ConfirmTransactionModal>
					</>
				)}
				{isVestingPeriodEnds && isAllVested && (
					<AllVestedBox totalVested={totalVested} underlyingDealToken={underlyingDealToken} />
				)}
			</ContentContainer>
		</Container>
	);
};

const Paragraph = styled.p`
	color: ${(props) => props.theme.colors.black};
	font-size: 1rem;
`;

export default VestingDealBox;
