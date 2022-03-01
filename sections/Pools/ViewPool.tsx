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
import SectionTitle from 'sections/shared/SectionTitle';

import FundDeal from 'sections/Deals/FundDeal';
import CreateDeal from 'sections/Deals/CreateDeal';

import VestingDealSection from 'sections/Deals/Vesting/VestingDealSection';
import UnredeemedTokensSection from 'sections/Deals/UnredeemedTokens/UnredeemedTokensSection';
import PurchasePoolSection from 'sections/Pools/PurchasePool/PurchasePoolSection';
import AcceptOrRejectDealSection from 'sections/Deals/AcceptOrReject/AcceptOrRejectSection';
import PoolDurationEndedSection from 'sections/Pools/PoolDurationEnded/PoolDurationEndedSection';

import { Tab, Tabs } from 'components/Tabs';
import { Status } from 'components/DealStatus';

import useInterval from 'hooks/useInterval';

import { getERC20Data } from 'utils/crypto';

import { swimmingPoolID } from 'constants/pool';
import { zeroAddress } from 'constants/token';
import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/defaults';
import {
	OPEN_POOL,
	CREATE_DEAL,
	FUND_DEAL,
	ACCEPT_OR_REJECT_DEAL,
	POOL_DURATION_ENDED,
	UNREDEEMED_TOKENS,
	VESTING_DEAL,
} from 'constants/poolStages';

interface ViewPoolProps {
	pool: PoolCreatedResult | null;
	poolAddress: string;
}

const ViewPool: FC<ViewPoolProps> = ({ pool, poolAddress }) => {
	const { walletAddress, provider, network } = Connector.useContainer();
	const [currentTab, setCurrentTab] = useState<number>(0);
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

				setClaimableUnderlyingTokens(claimableTokens);
			}
		}

		getClaimableTokens();
	}, DEFAULT_REQUEST_REFRESH_INTERVAL);

	const now = Date.now();

	const showCreateDealSection = useMemo(() => {
		if (!pool || !now || !deal || !walletAddress) return false;
		// If the connected wallet is not the sponsor, then we don't display the createDeal section
		if (walletAddress !== ethers.utils.getAddress(pool.sponsor)) return false;

		// This pool shouldn't be able to create a deal
		if (ethers.utils.getAddress(swimmingPoolID) === ethers.utils.getAddress(pool.id)) return false;

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

	const isPoolDurationEnded = useMemo(() => {
		return (
			pool?.poolStatus === Status.FundingDeal &&
			deal.holderFundingExpiration <= now &&
			now > (pool?.purchaseExpiry ?? 0) + (pool?.duration ?? 0) &&
			!(pool?.poolStatus === Status.DealOpen && deal?.id !== null)
		);
	}, [
		deal.holderFundingExpiration,
		deal?.id,
		now,
		pool?.duration,
		pool?.poolStatus,
		pool?.purchaseExpiry,
	]);

	const hasUnredeemedTokens = useMemo(() => {
		return (
			now >
				(deal?.proRataRedemptionPeriodStart ?? 0) +
					(deal?.proRataRedemptionPeriod ?? 0) +
					(deal?.openRedemptionPeriod ?? 0) && walletAddress === deal?.holder
		);
	}, [
		deal?.holder,
		deal?.openRedemptionPeriod,
		deal?.proRataRedemptionPeriod,
		deal?.proRataRedemptionPeriodStart,
		now,
		walletAddress,
	]);

	const isVestingDeal = useMemo(() => {
		return (
			(deal?.id != null &&
				((dealBalance != null && dealBalance > 0) || (claims ?? []).length > 0)) ||
			(claimableUnderlyingTokens ?? 0) > 0
		);
	}, [claimableUnderlyingTokens, claims, deal?.id, dealBalance]);

	const poolStages = {
		[OPEN_POOL]: () => ({
			title: 'Pool Info',
			displayName: 'PoolInfo',
			component: <PurchasePoolSection pool={pool} />,
		}),
		[CREATE_DEAL]: () => ({
			title: 'Create Deal',
			displayName: 'CreateDeal',
			component: <CreateDeal poolAddress={poolAddress} purchaseToken={pool.purchaseToken} />,
		}),
		[FUND_DEAL]: () => ({
			title: 'Fund Deal',
			displayName: 'FundDeal',
			component: (
				<FundDeal
					holder={ethers.utils.getAddress(deal?.holder ?? zeroAddress)}
					sponsor={ethers.utils.getAddress(pool?.sponsor ?? zeroAddress)}
					dealAddress={ethers.utils.getAddress(deal?.id ?? zeroAddress)}
					purchaseTokenTotalForDeal={deal?.purchaseTokenTotalForDeal}
					purchaseToken={pool.purchaseToken}
					token={deal?.underlyingDealToken}
					amount={deal?.underlyingDealTokenTotal}
					holderFundingExpiration={deal?.holderFundingExpiration}
				/>
			),
		}),
		[ACCEPT_OR_REJECT_DEAL]: () => ({
			title: 'Deal',
			displayName: 'Deal',
			component: (
				<AcceptOrRejectDealSection
					pool={pool}
					deal={deal}
					underlyingDealTokenDecimals={underlyingDealTokenDecimals}
					underlyingDealTokenSymbol={underlyingDealTokenSymbol}
				/>
			),
		}),
		[POOL_DURATION_ENDED]: () => ({
			title: 'Withdraw',
			displayName: 'Withdraw',
			component: (
				<PoolDurationEndedSection
					pool={pool}
					dealID={ethers.utils.getAddress(deal.id ?? zeroAddress)}
				/>
			),
		}),
		[UNREDEEMED_TOKENS]: () => ({
			title: 'Unredeemed Tokens',
			displayName: 'UnredeemedTokens',
			component: (
				<UnredeemedTokensSection
					holder={ethers.utils.getAddress(deal?.holder ?? zeroAddress)}
					token={deal.underlyingDealToken}
					dealAddress={ethers.utils.getAddress(deal.id ?? zeroAddress)}
				/>
			),
		}),
		[VESTING_DEAL]: () => ({
			title: 'Vest',
			displayName: 'Vest',
			component: (
				<VestingDealSection
					deal={deal}
					dealBalance={dealBalance}
					claims={claims}
					dealPerUnderlyingExchangeRate={Math.round(Number(1 / underlyingPerDealExchangeRate))}
					claimableUnderlyingTokens={claimableUnderlyingTokens}
					underlyingDealTokenDecimals={underlyingDealTokenDecimals}
				/>
			),
		}),
	};

	const currentStages = useMemo(() => {
		let stages = [OPEN_POOL];

		if (showCreateDealSection) {
			stages.push(CREATE_DEAL);
		}

		if (pool?.poolStatus === Status.FundingDeal) {
			stages.push(FUND_DEAL);
		}

		if (isPoolDurationEnded) {
			stages.push(POOL_DURATION_ENDED);
		}

		if (pool?.poolStatus === Status.DealOpen) {
			stages.push(ACCEPT_OR_REJECT_DEAL);
		}

		if (hasUnredeemedTokens) {
			stages.push(UNREDEEMED_TOKENS);
		}

		if (isVestingDeal) {
			stages.push(VESTING_DEAL);
		}

		return stages;
	}, [
		hasUnredeemedTokens,
		isPoolDurationEnded,
		isVestingDeal,
		pool?.poolStatus,
		showCreateDealSection,
	]);

	useEffect(() => {
		setCurrentTab(currentStages.length - 1);
	}, [setCurrentTab, currentStages.length, isPoolDurationEnded]);

	const isHolderAndSponsorEquals = useMemo(() => {
		try {
			return ethers.utils.getAddress(pool?.sponsor) === ethers.utils.getAddress(deal?.holder);
		} catch (err) {
			return false;
		}
	}, [deal?.holder, pool?.sponsor]);

	return (
		<PageLayout
			title={<SectionTitle address={poolAddress} title={`${pool?.name ?? 'Aelin'} Pool`} />}
			subtitle={pool?.hasAllowList ? 'Private pool' : 'Public pool'}
		>
			{isHolderAndSponsorEquals && currentStages[currentTab] === FUND_DEAL && (
				<Notice>
					We noticed you are the sponsor and the counter party. This is usually due to a pool
					cancellation unless you are sponsoring your own deal. If you cancelled the pool no further
					action is required
				</Notice>
			)}

			<Tabs
				defaultIndex={currentStages.length - 1}
				onSelect={(currentIndex) => setCurrentTab(currentIndex)}
			>
				{currentStages.map((currentStage) => (
					<Tab key={currentStage} label={poolStages[currentStage]().title}>
						{poolStages[currentStage]().component}
					</Tab>
				))}
			</Tabs>
		</PageLayout>
	);
};

const Notice = styled.p`
	width: 690px;
	color: ${(props) => props.theme.colors.red};
	border: 1px solid ${(props) => props.theme.colors.red};
	border-radius: 8px;
	padding: 15px 20px;
`;

export default ViewPool;
