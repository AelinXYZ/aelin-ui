import { FC, useMemo, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { FlexDiv } from 'components/common';
import dealAbi from 'containers/ContractsInterface/contracts/AelinDeal';
import Grid from 'components/Grid';
import TokenDisplay from 'components/TokenDisplay';
import ActionBox, { ActionBoxType } from 'components/ActionBox';
import { formatTimeDifference } from 'utils/time';
import TransactionData from 'containers/TransactionData';
import Connector from 'containers/Connector';
import TransactionNotifier from 'containers/TransactionNotifier';
import { Transaction } from 'constants/transactions';

interface VestingDealProps {
	deal: any;
	dealBalance: number | null;
	claims: any[];
	underlyingPerDealExchangeRate: number | null;
	claimableUnderlyingTokens: number | null;
}

const VestingDeal: FC<VestingDealProps> = ({
	deal,
	dealBalance,
	claims,
	underlyingPerDealExchangeRate,
	claimableUnderlyingTokens,
}) => {
	const { walletAddress, signer } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();
	const { txState, setTxState } = TransactionData.useContainer();
	console.log('claims', claims);

	const dealVestingGridItems = useMemo(
		() => [
			{
				header: 'Name',
				subText: deal?.name ?? '',
			},
			{
				header: 'Amount of Deal Tokens',
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
				header: 'Vesting Cliff',
				subText: formatTimeDifference(Number(deal?.vestingCliff ?? 0)),
			},
			{
				header: 'Vesting Period',
				subText: formatTimeDifference(Number(deal?.vestingPeriod ?? 0)),
			},
			{
				header: 'Total Underlying Claimed',
				subText: claims.reduce(
					(acc, curr) => acc + Number(curr.underlyingDealTokensClaimed.toString()),
					0
				),
			},
		],
		[
			claims,
			deal?.name,
			dealBalance,
			deal?.underlyingDealTokenTotal,
			deal?.purchaseTokenTotalForDeal,
			deal?.underlyingDealToken,
			deal?.vestingCliff,
			deal?.vestingPeriod,
		]
	);

	// TODO show vesting history
	const handleSubmit = useCallback(async () => {
		if (!walletAddress || !signer || !deal.id) return;
		const contract = new ethers.Contract(deal.id, dealAbi, signer);
		try {
			console.log('calling claim');
			const tx = await contract.claim({
				gasLimit: 1000000,
			});
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => setTxState(Transaction.SUCCESS),
				});
			}
		} catch (e) {
			setTxState(Transaction.FAILED);
		}
	}, [walletAddress, signer, monitorTransaction, deal.id, setTxState]);

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
				txState={txState}
				setTxState={setTxState}
			/>
		</FlexDiv>
	);
};

export default VestingDeal;
