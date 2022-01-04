//@ts-nocheck
import { ethers } from 'ethers';
import styled from 'styled-components';
import { PoolCreatedResult } from 'subgraph';
import { FC, useMemo, useState, useEffect } from 'react';

import Connector from 'containers/Connector';
import dealAbi from 'containers/ContractsInterface/contracts/AelinDeal';

import useGetDealDetailByIdQuery, {
	parseDealDetail,
} from 'queries/deals/useGetDealDetailByIdQuery';
import useGetDealByIdQuery, { parseDeal } from 'queries/deals/useGetDealByIdQuery';
import useGetClaimedUnderlyingDealTokensQuery, {
	parseClaimedResult,
} from 'queries/deals/useGetClaimedUnderlyingDealTokensQuery';

import { PageLayout } from 'sections/Layout';
import CreateDeal from 'sections/AelinDeal/CreateDeal';
import SectionTitle from 'sections/shared/SectionTitle';
import VestingDeal from 'sections/AelinDeal/VestingDeal';
import AcceptOrRejectDeal from 'sections/AelinDeal/AcceptOrRejectDeal';
import { SectionWrapper, ContentHeader, ContentTitle } from 'sections/Layout/PageLayout';

import { Status } from 'components/DealStatus';

import useInterval from 'hooks/useInterval';

import { getERC20Data } from 'utils/crypto';

import { vAelinPoolID } from 'constants/pool';
import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/defaults';

import FundDeal from '../AelinDeal/FundDeal';

import PurchasePool from './PurchasePool';
import PoolDurationEnded from './PoolDurationEnded';

interface ViewPoolProps {
	pool: PoolCreatedResult | null;
	poolAddress: string;
}

const ViewPool: FC<ViewPoolProps> = ({ pool, poolAddress }) => {
	const { walletAddress, provider, network } = Connector.useContainer();
	const [dealBalance, setDealBalance] = useState<number | null>(null);
	const [claimableUnderlyingTokens, setClaimableUnderlyingTokens] = useState<number | null>(null);
	const [underlyingPerDealExchangeRate, setUnderlyingPerDealExchangeRate] = useState<number | null>(
		null
	);
	const [underlyingDealTokenDecimals, setUnderlyingDealTokenDecimals] = useState<number | null>(
		null
	);
	const [underlyingDealTokenSymbol, setUnderlyingDealTokenSymbol] = useState<string | null>(null);
	const dealDetailsQuery = useGetDealDetailByIdQuery({
		id: pool?.dealAddress ?? '',
		networkId: network.id,
	});
	const dealQuery = useGetDealByIdQuery({ id: pool?.dealAddress ?? '', networkId: network.id });

	const deal = useMemo(() => {
		const dealDetails =
			dealDetailsQuery?.data != null ? parseDealDetail(dealDetailsQuery?.data) : {};
		const dealInfo = dealQuery?.data != null ? parseDeal(dealQuery?.data) : {};
		return { ...dealInfo, ...dealDetails };
	}, [dealQuery?.data, dealDetailsQuery?.data]);

	const claimedQuery = useGetClaimedUnderlyingDealTokensQuery({
		dealAddress: deal?.id ?? '',
		recipient: walletAddress ?? '',
		networkId: network.id,
	});

	const claims = useMemo(
		() => (claimedQuery?.data ?? []).map(parseClaimedResult),
		[claimedQuery?.data]
	);

	useEffect(() => {
		async function getDealInfo() {
			if (deal?.id != null && deal?.underlyingDealToken && provider != null) {
				const contract = new ethers.Contract(deal?.id, dealAbi, provider);
				const balance = walletAddress != null ? await contract.balanceOf(walletAddress) : 0;
				const decimals = await contract.decimals();
				const underlyingExchangeRate = await contract.underlyingPerDealExchangeRate();
				const claimable = walletAddress != null ? await contract.claimableTokens(walletAddress) : 0;
				const formattedDealBalance = Number(ethers.utils.formatUnits(balance, decimals));
				setDealBalance(formattedDealBalance);
				const { decimals: underlyingDecimals, symbol: underlyingSymbol } = await getERC20Data({
					address: deal?.underlyingDealToken,
					provider,
				});

				const claimableTokens = Number(
					ethers.utils.formatUnits(
						claimable?.underlyingClaimable?.toString() ?? '0',
						underlyingDecimals
					)
				);
				setClaimableUnderlyingTokens(claimableTokens);
				setUnderlyingDealTokenDecimals(underlyingDecimals);
				setUnderlyingPerDealExchangeRate(
					Number(
						ethers.utils.formatUnits(underlyingExchangeRate.toString(), underlyingDecimals ?? 0)
					)
				);
				setUnderlyingDealTokenSymbol(underlyingSymbol);
			}
		}
		getDealInfo();
	}, [deal?.id, provider, walletAddress, deal?.underlyingDealToken]);

	useInterval(() => {
		async function getClaimableTokens() {
			if (deal?.id != null && deal?.underlyingDealToken && provider != null) {
				const contract = new ethers.Contract(deal?.id, dealAbi, provider);

				const claimable = walletAddress != null ? await contract.claimableTokens(walletAddress) : 0;

				const claimableTokens = Number(
					ethers.utils.formatUnits(
						claimable?.underlyingClaimable?.toString() ?? '0',
						underlyingDealTokenDecimals
					)
				);
				console.log('claimableTokens: ', claimableTokens);
				setClaimableUnderlyingTokens(claimableTokens);
			}
		}

		getClaimableTokens();
	}, DEFAULT_REQUEST_REFRESH_INTERVAL);

	const now = Date.now();
	const showCreateDealSection = useMemo(() => {
		if (!pool || !now || !deal || !walletAddress) return false;
		// If the connected wallet is not the sponsor, then we don't display the createDeal section
		if (walletAddress !== pool.sponsor) return false;
		// If the Pool status is Open and PurchaseTokenCap is not null and is reached
		if (
			pool.poolStatus === Status.PoolOpen &&
			pool.purchaseTokenCap.gt(0) &&
			pool.contributions.eq(pool.purchaseTokenCap)
		)
			return true;
		// If the Pool status is SeekingDeal
		if (pool.poolStatus === Status.SeekingDeal) return true;
		// If the Pool status is FundingDeal and HolderFundingExpiration is reached
		if (pool.poolStatus === Status.FundingDeal && deal.holderFundingExpiration <= now) return true;
		return false;
	}, [deal, now, pool, walletAddress]);

	return (
		<PageLayout title={<SectionTitle address={poolAddress} title="Aelin Pool" />} subtitle="">
			<PurchasePool pool={pool} />
			{showCreateDealSection ? (
				<SectionWrapper>
					<ContentHeader>
						<ContentTitle>
							<SectionTitle address={null} title="Create Deal" />
						</ContentTitle>
					</ContentHeader>
					<CreateDeal poolAddress={poolAddress} />
				</SectionWrapper>
			) : null}
			{pool?.poolStatus === Status.FundingDeal && deal?.id != null ? (
				<SectionWrapper>
					<ContentHeader>
						<ContentTitle>
							<SectionTitle address={deal.id} title="Awaiting Funding of Proposed Deal" />
						</ContentTitle>
					</ContentHeader>
					<FundDeal
						holder={deal?.holder}
						dealAddress={deal?.id}
						purchaseTokenTotalForDeal={deal?.purchaseTokenTotalForDeal}
						purchaseToken={pool.purchaseToken}
						token={deal?.underlyingDealToken}
						amount={deal?.underlyingDealTokenTotal}
						holderFundingExpiration={deal?.holderFundingExpiration}
					/>
				</SectionWrapper>
			) : null}
			{pool?.poolStatus === Status.DealOpen && deal?.id != null ? (
				<SectionWrapper>
					<ContentHeader>
						<ContentTitle>
							<SectionTitle address={deal?.id} title="Aelin Deal" />
						</ContentTitle>
					</ContentHeader>
					<AcceptOrRejectDeal
						pool={pool}
						deal={deal}
						underlyingDealTokenDecimals={underlyingDealTokenDecimals}
						underlyingDealTokenSymbol={underlyingDealTokenSymbol}
					/>
				</SectionWrapper>
			) : null}
			{now > (pool?.purchaseExpiry ?? 0) + (pool?.duration ?? 0) &&
			pool?.id !== vAelinPoolID &&
			!(pool?.poolStatus === Status.DealOpen && deal?.id != null) ? (
				<PoolDurationEnded pool={pool} dealID={deal.id} />
			) : null}
			{(deal?.id != null &&
				((dealBalance != null && dealBalance > 0) || (claims ?? []).length > 0)) ||
			(claimableUnderlyingTokens ?? 0) > 0 ? (
				<SectionWrapper>
					<ContentHeader>
						<ContentTitle>
							<SectionTitle addToMetamask={true} address={deal.id} title="Deal Claiming" />
						</ContentTitle>
					</ContentHeader>
					<VestingDeal
						deal={deal}
						dealBalance={dealBalance}
						claims={claims}
						dealPerUnderlyingExchangeRate={Math.round(Number(1 / underlyingPerDealExchangeRate))}
						claimableUnderlyingTokens={claimableUnderlyingTokens}
						underlyingDealTokenDecimals={underlyingDealTokenDecimals}
					/>
				</SectionWrapper>
			) : null}
		</PageLayout>
	);
};

export default ViewPool;
