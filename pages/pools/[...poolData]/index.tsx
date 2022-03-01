//@ts-nocheck
import Head from 'next/head';
import styled from 'styled-components';
import { ethers, BigNumber } from 'ethers';
import { FC, useMemo, useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ViewPool from 'sections/Pools/ViewPool';

import useGetPoolByIdQuery from 'queries/pools/useGetPoolByIdQuery';
import { parsePool } from 'queries/pools/useGetPoolsQuery';
import Connector from 'containers/Connector';
import BaseModal from 'components/BaseModal';
import Button from 'components/Button';
import { nameToIdMapping } from 'constants/networks';

const Pool: FC = () => {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [userClosedModal, setUserClosedModal] = useState<boolean>(false);
	const { network, provider } = Connector.useContainer();
	const { poolData } = router.query;

	const address = poolData && poolData.length > 0 ? poolData[0] : null;
	const poolNetwork =
		poolData && poolData.length > 1 && Object.keys(nameToIdMapping).indexOf(poolData[1]) !== -1
			? poolData[1]
			: null;

	const poolAddress = (address ?? '') as string;

	const poolNetworkId = nameToIdMapping[poolNetwork];

	const poolQuery = useGetPoolByIdQuery({
		id: poolAddress,
		networkId: network.id,
	});

	const pool = useMemo(
		// @ts-ignore
		() => ((poolQuery?.data ?? null) != null ? parsePool(poolQuery.data) : null),
		[poolQuery?.data]
	);

	const handleSwitchChain = useCallback(async () => {
		if (!provider) return;
		const web3Provider = provider as ethers.providers.Web3Provider;
		if (!web3Provider.provider || !web3Provider.provider.request) return;
		const formattedChainId = ethers.utils.hexStripZeros(
			BigNumber.from(poolNetworkId).toHexString()
		);
		try {
			await web3Provider.provider.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: formattedChainId }],
			});
		} catch (e) {
			if (e?.message?.includes('Unrecognized chain ID')) {
				await web3Provider.provider.request({
					method: 'wallet_addEthereumChain',
					params: [OPTIMISM_NETWORKS[poolNetworkId]],
				});
			}
		}
	}, [poolNetworkId, provider]);

	useEffect(() => {
		if (pool == null && !userClosedModal && (!poolQuery.isLoading || poolQuery.failureCount > 0)) {
			setIsModalOpen(true);
		} else {
			setIsModalOpen(false);
		}
	}, [pool, poolQuery, userClosedModal]);

	return (
		<>
			<Head>
				<title>Aelin - {pool?.name ?? ''} Pool</title>
			</Head>

			<ViewPool pool={pool} poolAddress={poolAddress} />
			<BaseModal
				onClose={() => setUserClosedModal(true)}
				title="Switch Networks"
				setIsModalOpen={setIsModalOpen}
				isModalOpen={isModalOpen}
			>
				<ModalContainer>
					<p>We noticed you are connected to the wrong network for this pool.</p>
					{poolNetwork != null ? (
						<>
							<p>{`Please switch to ${poolNetwork} in order to see this pool`}</p>
							<br />
							<Button variant="primary" isRounded onClick={handleSwitchChain}>
								<StyledText>{`Switch to ${poolNetwork}`}</StyledText>
							</Button>
						</>
					) : (
						<>
							<p>Please use the network tab in the top right to switch networks.</p>
						</>
					)}
				</ModalContainer>
			</BaseModal>
		</>
	);
};

const StyledText = styled.span`
	font-size: 1rem;
	font-family: ${(props) => props.theme.fonts.ASMRegular};
`;

const ModalContainer = styled.div`
	text-align: center;
`;

export default Pool;
