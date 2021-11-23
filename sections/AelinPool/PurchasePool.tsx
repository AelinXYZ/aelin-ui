import { FC, useMemo, useState, useEffect } from 'react';

import Connector from 'containers/Connector';
import SectionDetails from 'sections/shared/SectionDetails';
import { ActionBoxType } from 'components/ActionBox';
import { truncateAddress } from 'utils/crypto';
import TimeLeft from 'components/TimeLeft';
import Ens from 'components/Ens';
import { PoolCreatedResult } from 'subgraph';
import { ethers } from 'ethers';
import { erc20Abi } from 'contracts/erc20';

interface PurchasePoolProps {
	pool: PoolCreatedResult | null;
}

const PurchasePool: FC<PurchasePoolProps> = ({ pool }) => {
	const { walletAddress, provider, signer } = Connector.useContainer();
	const [purchaseTokenSymbol, setPurchaseTokenSymbol] = useState<string>('');
	const [purchaseTokenAllowance, setPurchaseTokenAllowance] = useState<string>('0');
	const [userBalance, setUserBalance] = useState<string>('0');

	useEffect(() => {
		async function getUserBalance() {
			if (pool?.purchaseToken && pool?.id) {
				const purchaseTokenContract = new ethers.Contract(pool.purchaseToken, erc20Abi, provider);
				const balance = await purchaseTokenContract.balanceOf(walletAddress);
				const purchaseTokenDecimals = await purchaseTokenContract.decimals();
				const symbol = await purchaseTokenContract.symbol();
				const allowance = await purchaseTokenContract.allowance(walletAddress, pool.id);
				const formattedBalance = ethers.utils.formatUnits(balance, purchaseTokenDecimals);
				const formattedAllowance = ethers.utils.formatUnits(allowance, purchaseTokenDecimals);
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

	const handleSubmit = (value: number) => {
		if (!walletAddress || !signer) return;
	};

	const handleApprove = () => {
		if (!walletAddress || !signer) return;
	};

	return (
		<SectionDetails
			actionBoxType={ActionBoxType.FundPool}
			gridItems={poolGridItems}
			input={{
				placeholder: '0',
				label: `Balance ${userBalance} ${purchaseTokenSymbol}`,
				value: '0',
				maxValue: userBalance,
			}}
			allowance={purchaseTokenAllowance}
			onApprove={handleApprove}
			onSubmit={handleSubmit}
		/>
	);
};

export default PurchasePool;
