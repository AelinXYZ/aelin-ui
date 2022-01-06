import { FC, useMemo, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';
import { FlexDiv, ExternalLink, Notice } from 'components/common';
import dealAbi from 'containers/ContractsInterface/contracts/AelinDeal';
import Grid from 'components/Grid';
import TokenDisplay from 'components/TokenDisplay';
import ActionBox, { ActionBoxType } from 'components/ActionBox';
import { formatShortDateWithTime } from 'utils/time';
import TransactionData from 'containers/TransactionData';
import Connector from 'containers/Connector';
import TransactionNotifier from 'containers/TransactionNotifier';
import { TransactionStatus } from 'constants/transactions';
import { GasLimitEstimate } from 'constants/networks';
import { getGasEstimateWithBuffer } from 'utils/network';
import { DEFAULT_DECIMALS } from 'constants/defaults';
import { firstAelinPoolDealID } from 'constants/pool';
import { formatNumber } from 'utils/numbers';

interface VestingDealProps {
	deal: any;
	dealBalance: number | null;
	claims: any[];
	dealPerUnderlyingExchangeRate: number | null;
	underlyingDealTokenDecimals: number | null;
	claimableUnderlyingTokens: number | null;
}

const VestingDeal: FC<VestingDealProps> = ({
	deal,
	dealBalance,
	claims,
	dealPerUnderlyingExchangeRate,
	underlyingDealTokenDecimals,
	claimableUnderlyingTokens,
}) => {
	const { walletAddress, signer } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const { txState, setTxState, gasPrice, setGasPrice, setTxType, txType } =
		TransactionData.useContainer();
	const [isMaxValue, setIsMaxValue] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState(0);
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);

	const dealVestingGridItems = useMemo(() => {
		const claimedAmount = claims.reduce(
			(acc, curr) => acc + Number(curr.underlyingDealTokensClaimed.toString()),
			0
		);

		return [
			{
				header: 'Name',
				subText: deal?.name ?? '',
			},
			{
				header: 'My Deal Token Balance',
				subText: formatNumber(dealBalance ?? '0', DEFAULT_DECIMALS),
			},
			{
				header: 'Claiming Exchange Rate',
				subText: (
					<div>
						<Subheader>Deal token / Underlying Deal Token</Subheader>
						<div>{formatNumber(dealPerUnderlyingExchangeRate ?? '0', DEFAULT_DECIMALS)}</div>
					</div>
				),
			},
			{
				header: 'Underlying Deal Token',
				subText: <TokenDisplay address={deal?.underlyingDealToken ?? ''} displayAddress={true} />,
			},
			{
				header: 'Vesting Cliff Ends',
				subText: formatShortDateWithTime(
					Number(deal?.proRataRedemptionPeriodStart ?? 0) +
						Number(deal?.proRataRedemptionPeriod ?? 0) +
						Number(deal?.openRedemptionPeriod ?? 0) +
						Number(deal?.vestingCliff ?? 0)
				),
			},
			{
				header: 'Vesting Period Ends',
				subText: formatShortDateWithTime(
					Number(deal?.proRataRedemptionPeriodStart ?? 0) +
						Number(deal?.proRataRedemptionPeriod ?? 0) +
						Number(deal?.openRedemptionPeriod ?? 0) +
						Number(deal?.vestingCliff ?? 0) +
						Number(deal?.vestingPeriod ?? 0)
				),
			},
			{
				header: 'Total Underlying Claimed',
				subText: Number(
					ethers.utils.formatUnits(claimedAmount.toString(), underlyingDealTokenDecimals ?? 0)
				),
			},
		];
	}, [
		claims,
		deal?.name,
		dealBalance,
		deal?.underlyingDealToken,
		deal?.vestingCliff,
		deal?.vestingPeriod,
		dealPerUnderlyingExchangeRate,
		underlyingDealTokenDecimals,
		deal?.proRataRedemptionPeriodStart,
		deal?.proRataRedemptionPeriod,
		deal?.openRedemptionPeriod,
	]);

	const handleSubmit = useCallback(async () => {
		if (!walletAddress || !signer || !deal.id) return;
		const contract = new ethers.Contract(deal.id, dealAbi, signer);
		try {
			setTxState(TransactionStatus.WAITING);
			const tx = await contract.claim({
				gasLimit: getGasEstimateWithBuffer(gasLimitEstimate)?.toBN(),
				gasPrice: gasPrice.toBN(),
			});
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => setTxState(TransactionStatus.SUCCESS),
				});
			}
		} catch (e) {
			setTxState(TransactionStatus.FAILED);
		}
	}, [walletAddress, signer, monitorTransaction, deal.id, setTxState, gasLimitEstimate, gasPrice]);

	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (!deal.id || !signer) return setGasLimitEstimate(null);
			const contract = new ethers.Contract(deal.id, dealAbi, signer);
			try {
				let gasEstimate = wei(await contract.estimateGas.claim(), 0);
				setGasLimitEstimate(gasEstimate);
			} catch (e) {
				console.log(e);
				setGasLimitEstimate(null);
			}
		};
		getGasLimitEstimate();
	}, [deal.id, signer]);

	return (
		<div>
			<FlexDiv>
				<Grid hasInputFields={false} gridItems={dealVestingGridItems} />
				{deal?.id !== firstAelinPoolDealID ? (
					<ActionBox
						actionBoxType={ActionBoxType.VestingDeal}
						onSubmit={() => handleSubmit()}
						input={{
							placeholder: '0',
							label: '',
							maxValue: claimableUnderlyingTokens ?? 0,
						}}
						inputValue={inputValue}
						setInputValue={setInputValue}
						setIsMaxValue={setIsMaxValue}
						txState={txState}
						setGasPrice={setGasPrice}
						gasLimitEstimate={gasLimitEstimate}
						txType={txType}
						setTxType={setTxType}
					/>
				) : null}
			</FlexDiv>
			{deal?.id === firstAelinPoolDealID ? (
				<Notice>
					<>
						Due to an issue in the open redemption period of the first AELIN pool, claiming has been
						disabled. Instructions to claim your official $AELIN tokens will be added shortly. For
						more information please see
					</>{' '}
					<StyledExternalLink
						href={'https://github.com/AelinXYZ/AELIPs/blob/main/content/aelips/aelip-4.md'}
					>
						AELIP-4
					</StyledExternalLink>
				</Notice>
			) : null}
		</div>
	);
};

const StyledExternalLink = styled(ExternalLink)`
	color: ${(props) => props.theme.colors.statusBlue};
`;

const Subheader = styled.div`
	color: ${(props) => props.theme.colors.forestGreen};
	margin-bottom: 4px;
`;

export default VestingDeal;
