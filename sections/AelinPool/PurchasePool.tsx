import { FC, useMemo, useState, useEffect, useCallback } from 'react';

import Connector from 'containers/Connector';
import TransactionNotifier from 'containers/TransactionNotifier';
import SectionDetails from 'sections/shared/SectionDetails';
import { ActionBoxType } from 'components/ActionBox';
import { truncateAddress } from 'utils/crypto';
import TimeLeft from 'components/TimeLeft';
import Ens from 'components/Ens';
import { PoolCreatedResult } from 'subgraph';
import { ethers } from 'ethers';
import { erc20Abi } from 'contracts/erc20';
import { poolAbi } from 'contracts/pool';

interface PurchasePoolProps {
	pool: PoolCreatedResult | null;
}

const PurchasePool: FC<PurchasePoolProps> = ({ pool }) => {
	const { walletAddress, provider, signer } = Connector.useContainer();
	const { monitorTransaction } = TransactionNotifier.useContainer();

	const [purchaseTokenDecimals, setPurchaseTokenDecimlas] = useState<number | null>(null);
	const [purchaseTokenSymbol, setPurchaseTokenSymbol] = useState<string>('');
	const [purchaseTokenAllowance, setPurchaseTokenAllowance] = useState<string>('0');
	const [userBalance, setUserBalance] = useState<string>('0');

	useEffect(() => {
		async function getUserBalance() {
			if (pool?.purchaseToken && pool?.id) {
				const contract = new ethers.Contract(pool.purchaseToken, erc20Abi, provider);
				const balance = await contract.balanceOf(walletAddress);
				const decimals = await contract.decimals();
				const symbol = await contract.symbol();
				const allowance = await contract.allowance(walletAddress, pool.id);
				const formattedBalance = ethers.utils.formatUnits(balance, decimals);
				const formattedAllowance = ethers.utils.formatUnits(allowance, decimals);
				setPurchaseTokenDecimlas(decimals);
				setUserBalance(formattedBalance.toString());
				setPurchaseTokenSymbol(symbol);
				setPurchaseTokenAllowance(formattedAllowance.toString());
			}
		}
		getUserBalance();
	}, [pool?.purchaseToken, pool?.id, provider, walletAddress]);

	const poolGridItems = useMemo(
		() => [
			{
				header: 'Sponsor',
				subText: <Ens address={pool?.sponsor ?? ''} />,
			},
			{
				header: 'My Capital',
				subText: '',
			},
			{
				header: 'Purchase Token Cap',
				subText: pool?.purchaseTokenCap.toNumber() ?? '',
			},
			{
				header: 'Purchase Token',
				subText: truncateAddress(pool?.purchaseToken ?? ''),
			},
			{
				header: 'Ownership',
				subText: 'some subText',
			},
			{
				header: 'Status',
				subText: 'some subText',
			},
			{
				header: 'Sponsor Fee',
				subText: pool?.sponsorFee || 0,
			},
			{
				header: 'Purchase Expiration',
				subText: <TimeLeft timeLeft={pool?.duration ?? 0} />,
			},
			{
				header: 'Pool Duration',
				subText: <TimeLeft timeLeft={pool?.duration ?? 0} />,
			},
		],
		[pool]
	);

	const handleSubmit = useCallback(
		async (value: number) => {
			if (!walletAddress || !signer || !pool?.id || !purchaseTokenDecimals) return;
			const contract = new ethers.Contract(pool.id, poolAbi, signer);
			const tx = await contract.purchasePoolTokens(
				ethers.utils.parseUnits(value.toString(), purchaseTokenDecimals),
				// TODO update gasPrice and gasLimit
				{
					gasLimit: 1000000,
				}
			);
			if (tx) {
				monitorTransaction({
					txHash: tx.hash,
					onTxConfirmed: () => console.log('TODO proper workflow from success'),
				});
			}
		},
		[walletAddress, signer, monitorTransaction, pool?.id, purchaseTokenDecimals]
	);

	const handleApprove = useCallback(async () => {
		if (!walletAddress || !signer || !pool?.id || !pool?.purchaseToken) return;
		const contract = new ethers.Contract(pool.purchaseToken, erc20Abi, signer);
		const tx = await contract.approve(
			pool.id,
			ethers.constants.MaxUint256,
			// TODO update gasPrice and gasLimit
			{
				gasLimit: 1000000,
			}
		);
		if (tx) {
			monitorTransaction({
				txHash: tx.hash,
				onTxConfirmed: () => console.log('TODO proper workflow from approve'),
			});
		}
	}, [pool?.id, pool?.purchaseToken, monitorTransaction, walletAddress, signer]);

	return (
		<SectionDetails
			actionBoxType={ActionBoxType.FundPool}
			gridItems={poolGridItems}
			input={{
				placeholder: '0',
				label: `Balance ${userBalance} ${purchaseTokenSymbol}`,
				value: '0',
				maxValue: userBalance,
				symbol: purchaseTokenSymbol,
			}}
			allowance={purchaseTokenAllowance}
			onApprove={handleApprove}
			onSubmit={handleSubmit}
		/>
	);
};

export default PurchasePool;
