import { FC, useState, useMemo } from 'react';
import Image from 'next/image';
import { ethers } from 'ethers';
import styled from 'styled-components';
import Wei from '@synthetixio/wei';

import EtherscanLogo from 'assets/svg/etherscan-logo.svg';

import { Tab, Tabs } from 'components/Tabs';
import QuestionMark from 'components/QuestionMark';
import { FlexDiv, FlexDivColCentered } from 'components/common';
import ConfirmTransactionModal from 'components/ConfirmTransactionModal';

import { GasLimitEstimate } from 'constants/networks';

import { formatNumber } from 'utils/numbers';

import Connector from 'containers/Connector';
import Etherscan from 'containers/BlockExplorer';

import TabContent from '../TabContent';
import { StakeActionLabel } from '../constants';

export type InputType = {
	placeholder: string;
	label: string;
	symbol: string;
};

interface ActionBoxProps {
	header: string;
	tooltipInfo: string;
	apyTooltip: string;
	apy: any;
	onSubmit: () => void;
	input: InputType;
	onApprove: () => void;
	setGasPrice: Function;
	gasLimitEstimate: GasLimitEstimate;
	setIsMaxValue: (isMax: boolean) => void;
	inputValue: number | string;
	setInputValue: (inputValue: number | string) => void;
	balance: Wei;
	isApproved: boolean;
	action: StakeActionLabel;
	setAction: (action: StakeActionLabel) => void;
	stakingContract: ethers.Contract | null;
}

const ActionBox: FC<ActionBoxProps> = ({
	header,
	tooltipInfo,
	apyTooltip,
	apy,
	onSubmit,
	input: { placeholder, label, symbol },
	onApprove,
	setGasPrice,
	gasLimitEstimate,
	setIsMaxValue,
	inputValue,
	setInputValue,
	action,
	setAction,
	isApproved,
	balance,
	stakingContract,
}) => {
	const { walletAddress } = Connector.useContainer();
	const { blockExplorerInstance } = Etherscan.useContainer();

	const [showTxModal, setShowTxModal] = useState(false);

	const modalContent = useMemo(() => {
		if (!isApproved) {
			return {
				onSubmit: onApprove,
				heading: 'Confirm Approval',
			};
		}
		if (action === StakeActionLabel.DEPOSIT) {
			return {
				onSubmit: onSubmit,
				heading: `Confirm deposit of ${inputValue} ${symbol}`,
			};
		}
		if (action === StakeActionLabel.WITHDRAW) {
			return {
				onSubmit: onSubmit,
				heading: `Confirm withdrawal of ${inputValue} ${symbol}`,
			};
		}
	}, [isApproved, onApprove, action, onSubmit, inputValue, symbol]);

	const isActionButtonDisabled: boolean = useMemo(() => {
		if (!walletAddress || !inputValue) return true;

		if (!isApproved) {
			return true;
		}

		if (balance?.toNumber() < inputValue) return true;

		return false;
	}, [walletAddress, inputValue, isApproved, balance]);

	const isApproveButtonDisabled: boolean = useMemo(() => {
		if (!walletAddress || isApproved) {
			return true;
		}

		return false;
	}, [walletAddress, isApproved]);

	return (
		<Container>
			<HeaderSection>
				<HeaderRow>
					<Header>
						<EtherscanLink
							href={blockExplorerInstance?.addressLink(stakingContract?.address!)}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Image width="20" height="20" src={EtherscanLogo} alt="etherscan logo" />
						</EtherscanLink>
						{header}
					</Header>
					<QuestionMark solid text={tooltipInfo} />
				</HeaderRow>
				<SubHeader>
					<FlexDiv>
						{apy === null ? 'APY: TBD' : `APY: ${formatNumber(apy?.toFixed(0) ?? 0, 0)}%`}
						<QuestionMark solid text={apyTooltip} />
					</FlexDiv>
				</SubHeader>
			</HeaderSection>

			<Tabs
				defaultIndex={0}
				onSelect={(selectedIndex: number) => {
					if (selectedIndex === 0) {
						return setAction(StakeActionLabel.DEPOSIT);
					}
					if (selectedIndex === 1) {
						return setAction(StakeActionLabel.WITHDRAW);
					}

					throw new Error('Unexpected Index');
				}}
			>
				<Tab label="Deposit">
					<TabContent
						balance={balance}
						label={label}
						action={action}
						placeholder={placeholder}
						inputValue={inputValue}
						setIsMaxValue={setIsMaxValue}
						setInputValue={setInputValue}
						setShowTxModal={setShowTxModal}
						isApproveButtonDisabled={isApproveButtonDisabled}
						isActionButtonDisabled={isActionButtonDisabled}
					/>
				</Tab>

				<Tab label="Withdraw">
					<TabContent
						balance={balance}
						label={label}
						action={action}
						placeholder={placeholder}
						inputValue={inputValue}
						setIsMaxValue={setIsMaxValue}
						setInputValue={setInputValue}
						setShowTxModal={setShowTxModal}
						isApproveButtonDisabled={isApproveButtonDisabled}
						isActionButtonDisabled={isActionButtonDisabled}
					/>
				</Tab>
			</Tabs>

			<ConfirmTransactionModal
				title="Confirm Transaction"
				setIsModalOpen={setShowTxModal}
				isModalOpen={showTxModal}
				setGasPrice={setGasPrice}
				gasLimitEstimate={gasLimitEstimate}
				onSubmit={modalContent?.onSubmit}
			>
				{modalContent?.heading}
			</ConfirmTransactionModal>
		</Container>
	);
};

const EtherscanLink = styled.a`
	position: absolute;
	top: 15px;
	right: 15px;
`;

const HeaderSection = styled(FlexDivColCentered)`
	margin: 0 0 20px 0;
`;

const HeaderRow = styled(FlexDiv)`
	align-items: center;
`;

const SubHeader = styled.h4`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	font-weight: 400;
	margin: 0;
	margin-top: 10px;
	padding: 0;
`;

const Header = styled.h3`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.6rem;
	font-weight: 600;
	margin: 0;
	padding: 0;
`;

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.tablePrimary};
	width: 420px;
	padding: 30px 60px;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.tableBorders};
	position: relative;
`;

export default ActionBox;
