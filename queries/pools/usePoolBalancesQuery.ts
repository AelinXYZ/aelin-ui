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
	isOpenEligible: boolean;
	maxProRata: number;
	totalAmountAccepted: string;
	userAmountAccepted: string;
	userAmountWithdrawn: string;
	totalSupply: number;
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
				unformattedMaxProRata,
				isOpenEligible,
				totalAmountAccepted,
				totalAmountWithdrawn,
				userAmountAccepted,
				userAmountWithdrawn,
				unformattedTotalSupply,
			] = await Promise.all([
				walletAddress != null ? poolContract.balanceOf(walletAddress) : 0,
				walletAddress != null ? tokenContract.balanceOf(walletAddress) : 0,
				tokenContract.decimals(),
				tokenContract.symbol(),
				walletAddress != null ? tokenContract.allowance(walletAddress, poolAddress) : 0,
				poolContract.hasAllowList(),
				walletAddress != null ? poolContract.allowList(walletAddress) : 0,
				walletAddress != null ? poolContract.maxProRataAmount(walletAddress) : 0,
				walletAddress != null ? poolContract.openPeriodEligible(walletAddress) : false,
				poolContract.totalAmountAccepted(),
				poolContract.totalAmountWithdrawn(),
				walletAddress != null ? poolContract.amountAccepted(walletAddress) : 0,
				walletAddress != null ? poolContract.amountWithdrawn(walletAddress) : 0,
				poolContract.totalSupply(),
				poolContract.purchaseTokenCap(),
			]);
			return {
				purchaseTokenDecimals: decimals,
				purchaseTokenSymbol: symbol,
				purchaseTokenAllowance: ethers.utils.formatUnits(allowance, decimals).toString(),
				userPurchaseBalance: ethers.utils.formatUnits(balance, decimals).toString(),
				userPoolBalance: ethers.utils.formatUnits(poolBalance, decimals).toString(),
				isPrivatePool: hasAllowList,
				privatePoolAmount: Number(ethers.utils.formatUnits(unformattedAllowListAmount, decimals)),
				maxProRata: Number(ethers.utils.formatUnits(unformattedMaxProRata, decimals)),
				totalAmountAccepted: totalAmountAccepted.toString(),
				totalAmountWithdrawn: totalAmountWithdrawn.toString(),
				userAmountWithdrawn: userAmountWithdrawn.toString(),
				userAmountAccepted: userAmountAccepted.toString(),
				isOpenEligible,
				totalSupply: Number(ethers.utils.formatUnits(unformattedTotalSupply, decimals)),
			};
		},
		{
			enabled: !!purchaseToken && !!poolAddress && !!provider,
		}
	);
};

export default usePoolBalancesQuery;
