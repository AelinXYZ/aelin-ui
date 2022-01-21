//@ts-nocheck
import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import {
	TransactionNotifier,
	TransactionNotifierInterface,
} from '@synthetixio/transaction-notifier';
import { detectEthereumProvider } from 'utils/metmask-detect-provider';
import { loadProvider } from '@synthetixio/providers';
import { OPTIMISM_NETWORKS } from '@synthetixio/optimism-networks';
import { ethers } from 'ethers';

import { Wallet as OnboardWallet } from 'bnc-onboard/dist/src/interfaces';

import useLocalStorage from 'hooks/useLocalStorage';

import { initOnboard } from './config';
import { chainIdMapping, NetworkId, Network as NetworkName, NetworkType } from 'constants/networks';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { DEFAULT_NETWORK_ID } from 'constants/defaults';

export async function getDefaultNetworkId(): Promise<NetworkId> {
	try {
		const provider = await detectEthereumProvider();
		if (provider && provider.chainId) {
			return Number(provider.chainId);
		}
		return DEFAULT_NETWORK_ID;
	} catch (e) {
		console.log(e);
		return DEFAULT_NETWORK_ID;
	}
}

const useConnector = () => {
	const [isOVM, setIsOVM] = useState<boolean>(false);
	const [network, setNetwork] = useState<NetworkType>({
		id: NetworkId['Optimism-Mainnet'],
		name: NetworkName['Optimism-Mainnet'],
	});
	const [provider, setProvider] = useState<ethers.providers.Provider | undefined>(undefined);
	const [signer, setSigner] = useState<ethers.Signer | null>(null);
	const [onboard, setOnboard] = useState<ReturnType<typeof initOnboard> | null>(null);
	const [isAppReady, setAppReady] = useState(false);
	const [walletAddress, setWalletAddress] = useState(null);
	const [selectedWallet, setSelectedWallet] = useLocalStorage<string | null>(
		LOCAL_STORAGE_KEYS.SELECTED_WALLET,
		''
	);
	const [transactionNotifier, setTransactionNotifier] =
		useState<TransactionNotifierInterface | null>(null);

	const verifyIfOptimism = (networkId: NetworkId | null) => {
		if (networkId) {
			setIsOVM(!!OPTIMISM_NETWORKS[networkId]);
		}
	};

	useEffect(() => {
		const init = async () => {
			const networkId = await getDefaultNetworkId();
			const provider = loadProvider({
				networkId,
				infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
				provider: window.ethereum,
			});

			verifyIfOptimism(networkId);

			// @ts-ignore
			setNetwork({ id: networkId, name: chainIdMapping[networkId] });
			setProvider(provider);
			setAppReady(true);
		};

		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isAppReady) {
			const onboard = initOnboard(network, {
				// @ts-ignore
				address: setWalletAddress,
				network: (networkId: number) => {
					// @ts-ignore
					const isSupportedNetwork = chainIdMapping[networkId] ? true : false;

					if (isSupportedNetwork) {
						const provider = loadProvider({
							provider: onboard.getState().wallet.provider,
						});
						const signer = provider.getSigner();

						onboard.config({ networkId });
						if (transactionNotifier) {
							transactionNotifier.setProvider(provider);
						} else {
							setTransactionNotifier(new TransactionNotifier(provider));
						}
						setProvider(provider);
						setSigner(signer);
						setNetwork({
							id: networkId as NetworkId,
							// @ts-ignore
							name: chainIdMapping[networkId] as NetworkName,
						});
						verifyIfOptimism(networkId);
					}
				},
				wallet: async (wallet: OnboardWallet) => {
					if (wallet.provider) {
						// TODO update
						const provider = loadProvider({ provider: wallet.provider });
						const network = await provider.getNetwork();
						const networkId = network.chainId as NetworkId;

						setProvider(provider);
						setSigner(provider.getSigner());
						setNetwork({
							id: networkId,
							// @ts-ignore
							name: chainIdMapping[networkId] as NetworkName,
						});
						setSelectedWallet(wallet.name);
						setTransactionNotifier(new TransactionNotifier(provider));
					} else {
						// TODO: setting provider to null might cause issues, perhaps use a default provider?
						// setProvider(null);
						setSigner(null);
						setWalletAddress(null);
						setSelectedWallet(null);
					}
				},
			});

			setOnboard(onboard);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAppReady]);

	// load previously saved wallet
	useEffect(() => {
		if (onboard && selectedWallet && !walletAddress) {
			onboard.walletSelect(selectedWallet);
		}
	}, [onboard, selectedWallet, walletAddress]);

	const connectWallet = async () => {
		try {
			if (onboard) {
				onboard.walletReset();
				const success = await onboard.walletSelect();
				if (success) {
					await onboard.walletCheck();
				}
			}
		} catch (e) {
			console.log(e);
		}
	};

	const disconnectWallet = async () => {
		try {
			if (onboard) {
				onboard.walletReset();
			}
		} catch (e) {
			console.log(e);
		}
	};

	const switchAccounts = async () => {
		try {
			if (onboard) {
				onboard.accountSelect();
			}
		} catch (e) {
			console.log(e);
		}
	};

	const isHardwareWallet = () => {
		if (onboard) {
			const onboardState = onboard.getState();
			if (onboardState.address != null) {
				return onboardState.wallet.type === 'hardware';
			}
		}
		return false;
	};

	return {
		network,
		walletAddress,
		isAppReady,
		provider,
		signer,
		onboard,
		connectWallet,
		disconnectWallet,
		switchAccounts,
		isHardwareWallet,
		transactionNotifier,
		selectedWallet,
		isOVM,
	};
};

const Connector = createContainer(useConnector);

export default Connector;
