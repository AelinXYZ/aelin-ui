import { FC, useMemo, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { wei } from '@synthetixio/wei';
import { isAfter } from 'date-fns';

import Grid from 'components/Grid';
import TokenDisplay from 'components/TokenDisplay';
import { FlexDiv } from 'components/common';

import Connector from 'containers/Connector';
import TransactionData from 'containers/TransactionData';
import TransactionNotifier from 'containers/TransactionNotifier';
import dealAbi from 'containers/ContractsInterface/contracts/AelinDeal';

import { formatShortDateWithTime } from 'utils/time';
import { getGasEstimateWithBuffer } from 'utils/network';

import { GasLimitEstimate } from 'constants/networks';
import { TransactionStatus } from 'constants/transactions';

import VestingDealBox from '../VestingBox';
import { DEFAULT_DECIMALS } from 'constants/defaults';

interface VestingDealProps {
	deal: any;
	claims: any[];
	underlyingDealTokenDecimals: number | null;
	claimableUnderlyingTokens: number | null;
}

const VestingDeal: FC<VestingDealProps> = ({
	deal,
	claims,
	underlyingDealTokenDecimals,
	claimableUnderlyingTokens,
}) => {
	const { walletAddress, signer } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const { setTxState, gasPrice } = TransactionData.useContainer();
	const [gasLimitEstimate, setGasLimitEstimate] = useState<GasLimitEstimate>(null);

	const totalVested = useMemo(() => {
		if (!underlyingDealTokenDecimals) {
			return null;
		}

		const claimedAmount = (claims ?? []).reduce(
			(acc, curr) => acc.add(curr.underlyingDealTokensClaimed),
			wei(0)
		);

		return Number(ethers.utils.formatUnits(claimedAmount.toString(0), underlyingDealTokenDecimals));
	}, [claims, underlyingDealTokenDecimals]);

	const isVestingCliffEnds = useMemo(() => {
		return isAfter(
			new Date(),
			Number(deal?.proRataRedemptionPeriodStart ?? 0) +
				Number(deal?.proRataRedemptionPeriod ?? 0) +
				Number(deal?.openRedemptionPeriod ?? 0) +
				Number(deal?.vestingCliff ?? 0)
		);
	}, [
		deal?.openRedemptionPeriod,
		deal?.proRataRedemptionPeriod,
		deal?.proRataRedemptionPeriodStart,
		deal?.vestingCliff,
	]);

	const isVestingPeriodEnds = useMemo(() => {
		return isAfter(
			new Date(),
			Number(deal?.proRataRedemptionPeriodStart ?? 0) +
				Number(deal?.proRataRedemptionPeriod ?? 0) +
				Number(deal?.openRedemptionPeriod ?? 0) +
				Number(deal?.vestingCliff ?? 0) +
				Number(deal?.vestingPeriod ?? 0)
		);
	}, [
		deal?.openRedemptionPeriod,
		deal?.proRataRedemptionPeriod,
		deal?.proRataRedemptionPeriodStart,
		deal?.vestingCliff,
		deal?.vestingPeriod,
	]);

	const dealVestingGridItems = useMemo(() => {
		return [
			{
				header: 'Name',
				subText: deal?.name ?? '',
			},
			{
				header: 'Total Vested',
				subText: (
					<>
						{totalVested !== null ? (
							<>
								{totalVested}{' '}
								<TokenDisplay address={deal?.underlyingDealToken ?? ''} displayAddress={false} />
							</>
						) : (
							'Loading...'
						)}
					</>
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
		];
	}, [
		deal?.name,
		deal?.underlyingDealToken,
		deal?.proRataRedemptionPeriodStart,
		deal?.proRataRedemptionPeriod,
		deal?.openRedemptionPeriod,
		deal?.vestingCliff,
		deal?.vestingPeriod,
		totalVested,
	]);

	const handleSubmit = useCallback(async () => {
		if (!walletAddress || !signer || !deal.id) {
			return;
		}
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
			if (!deal.id || !signer) {
				return setGasLimitEstimate(null);
			}
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
			<VestingDealBox
				onSubmit={handleSubmit}
				vestingAmount={claimableUnderlyingTokens ?? 0}
				gasLimitEstimate={gasLimitEstimate}
				isVestingCliffEnds={isVestingCliffEnds}
				isVestingPeriodEnds={isVestingPeriodEnds}
				totalVested={totalVested}
				underlyingDealToken={deal?.underlyingDealToken ?? ''}
			/>
		</FlexDiv>
	);
};

export default VestingDeal;
