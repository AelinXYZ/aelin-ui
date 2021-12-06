import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Connector from 'containers/Connector';
import poolAbi from 'containers/ContractsInterface/contracts/AelinPool';
import { erc20Abi } from 'contracts/erc20';
import { UseQueryOptions, useQuery } from 'react-query';

type PoolBalances = {
	purchaseTokenDecimals: number;
	purchaseTokenSymbol: string;
	purchaseTokenAllowance: string;
	userPurchaseBalance: string;
	userPoolBalance: string;
	isPrivatePool: boolean;
	privatePoolAmount: number;
};

const usePoolBalancesQuery = ({
	purchaseToken,
	poolAddress,
}: {
	purchaseToken: string | null;
	poolAddress: string | null;
}) => {
	const { walletAddress, provider } = Connector.useContainer();
	return useQuery<PoolBalances>(
		['poolBalances', purchaseToken, poolAddress],
		async () => {
			const poolContract = new ethers.Contract(poolAddress!, poolAbi, provider);
			const tokenContract = new ethers.Contract(purchaseToken!, erc20Abi, provider);
			const [
				poolBalance,
				balance,
				decimals,
				symbol,
				allowance,
				hasAllowList,
				unformattedAllowListAmount,
			] = await Promise.all([
				poolContract.balanceOf(walletAddress),
				tokenContract.balanceOf(walletAddress),
				tokenContract.decimals(),
				tokenContract.symbol(),
				tokenContract.allowance(walletAddress, poolAddress),
				poolContract.hasAllowList(),
				poolContract.allowList(walletAddress),
			]);
			return {
				purchaseTokenDecimals: decimals,
				purchaseTokenSymbol: symbol,
				purchaseTokenAllowance: ethers.utils.formatUnits(allowance, decimals).toString(),
				userPurchaseBalance: ethers.utils.formatUnits(balance, decimals).toString(),
				userPoolBalance: ethers.utils.formatUnits(poolBalance, decimals).toString(),
				isPrivatePool: hasAllowList,
				privatePoolAmount: Number(ethers.utils.formatUnits(unformattedAllowListAmount, decimals)),
			};
		},
		{
			enabled: !!purchaseToken && !!poolAddress && !!provider && !!walletAddress,
		}
	);
};

export default usePoolBalancesQuery;
