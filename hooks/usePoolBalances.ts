import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Connector from 'containers/Connector';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';
import { erc20Abi } from 'contracts/erc20';

const usePoolBalances = ({
	purchaseToken,
	poolAddress,
}: {
	purchaseToken: string | null;
	poolAddress: string | null;
}) => {
	const { walletAddress, provider } = Connector.useContainer();
	const [purchaseTokenDecimals, setPurchaseTokenDecimlas] = useState<number | null>(null);
	const [purchaseTokenSymbol, setPurchaseTokenSymbol] = useState<string>('');
	const [purchaseTokenAllowance, setPurchaseTokenAllowance] = useState<string>('0');
	const [userPurchaseBalance, setUserPurchaseBalance] = useState<string>('0');
	const [userPoolBalance, setUserPoolBalance] = useState<string>('0');
	const [isPrivatePool, setIsPrivatePool] = useState<boolean>(false);
	const [privatePoolAmount, setPrivatePoolAmount] = useState<string>('0');

	useEffect(() => {
		async function getUserBalance() {
			if (
				purchaseToken != null &&
				poolAddress != null &&
				provider != null &&
				walletAddress != null
			) {
				const poolContract = new ethers.Contract(poolAddress, poolAbi, provider);
				const poolBalance = await poolContract.balanceOf(walletAddress);
				const hasAllowList = await poolContract.hasAllowList();

				const contract = new ethers.Contract(purchaseToken, erc20Abi, provider);
				const balance = await contract.balanceOf(walletAddress);
				const decimals = await contract.decimals();
				const symbol = await contract.symbol();
				const allowance = await contract.allowance(walletAddress, poolAddress);

				let allowListAmount = '0';
				if (hasAllowList) {
					const unformattedAllowListAmount = await poolContract.allowList(walletAddress);
					allowListAmount = Number(
						ethers.utils.formatUnits(unformattedAllowListAmount, decimals)
					).toString();
				}

				const formattedBalance = ethers.utils.formatUnits(balance, decimals);
				const formattedAllowance = ethers.utils.formatUnits(allowance, decimals);
				const formattedPoolBalance = ethers.utils.formatUnits(poolBalance, decimals);
				setIsPrivatePool(hasAllowList);
				setPrivatePoolAmount(allowListAmount);
				setPurchaseTokenDecimlas(decimals);
				setUserPurchaseBalance(formattedBalance.toString());
				setUserPoolBalance(formattedPoolBalance.toString());
				setPurchaseTokenSymbol(symbol);
				setPurchaseTokenAllowance(formattedAllowance.toString());
			}
		}
		getUserBalance();
	}, [purchaseToken, poolAddress, provider, walletAddress]);

	return {
		purchaseTokenDecimals,
		purchaseTokenSymbol,
		purchaseTokenAllowance,
		userPurchaseBalance,
		userPoolBalance,
		isPrivatePool,
		privatePoolAmount,
	};
};

export default usePoolBalances;
