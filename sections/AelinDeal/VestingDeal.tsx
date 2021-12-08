import { FC, useMemo, useCallback, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';
import { FlexDiv } from 'components/common';
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

interface VestingDealProps {
	deal: any;
	dealBalance: number | null;
	claims: any[];
	underlyingPerDealExchangeRate: number | null;
	underlyingDealTokenDecimals: number | null;
	claimableUnderlyingTokens: number | null;
}

const VestingDeal: FC<VestingDealProps> = ({
	deal,
	dealBalance,
	claims,
	underlyingPerDealExchangeRate,
	underlyingDealTokenDecimals,
	claimableUnderlyingTokens,
}) => {
	const { walletAddress, signer } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const {
		txState,
		setTxState,
		gasPrice,
		setGasPrice,
		setTxType,
		txType,
		inputValue,
		setInputValue,
		setIsMaxValue,
	} = TransactionData.useContainer();
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
				subText: dealBalance ?? '',
			},
			{
				header: 'Exchange rate',
				subText: underlyingPerDealExchangeRate,
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
		underlyingPerDealExchangeRate,
		underlyingDealTokenDecimals,
		deal?.proRataRedemptionPeriodStart,
		deal?.proRataRedemptionPeriod,
		deal?.openRedemptionPeriod,
	]);

	const handleSubmit = useCallback(async () => {
		if (!walletAddress || !signer || !deal.id) return;
		const contract = new ethers.Contract(deal.id, dealAbi, signer);
		try {
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
		<FlexDiv>
			<Grid hasInputFields={false} gridItems={dealVestingGridItems} />
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
		</FlexDiv>
	);
};

export default VestingDeal;
