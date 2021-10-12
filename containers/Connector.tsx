import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import {
	TransactionNotifier,
	TransactionNotifierInterface,
} from '@synthetixio/transaction-notifier';
import detectEthereumProvider from '@metamask/detect-provider';

import {
	NetworkId,
	Network as NetworkName,
	SynthetixJS,
	synthetix,
} from '@synthetixio/contracts-interface';
import { ethers } from 'ethers';

import { Wallet as OnboardWallet } from 'bnc-onboard/dist/src/interfaces';

import useLocalStorage from 'hooks/useLocalStorage';

import { initOnboard } from './config';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { DEFAULT_NETWORK_ID } from 'constants/defaults';

type EthereumProvider = {
	isMetaMask: boolean;
	chainId: string;
};

export async function getDefaultNetworkId(): Promise<NetworkId> {
	try {
		const provider = (await detectEthereumProvider()) as EthereumProvider;
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
	const [network, setNetwork] = useState({ id: NetworkId.Mainnet, name: NetworkName.Mainnet });
	const [provider, setProvider] = useState<ethers.providers.Provider | null>(null);
	const [signer, setSigner] = useState<ethers.Signer | null>(null);
	const [synthetixjs, setSynthetixjs] = useState<SynthetixJS | null>(null);
	const [onboard, setOnboard] = useState<ReturnType<typeof initOnboard> | null>(null);
	const [isAppReady, setAppReady] = useState(false);
	const [walletAddress, setWalletAddress] = useState(null);
	const [selectedWallet, setSelectedWallet] = useLocalStorage<string | null>(
		LOCAL_STORAGE_KEYS.SELECTED_WALLET,
		''
	);
	const [transactionNotifier, setTransactionNotifier] =
		useState<TransactionNotifierInterface | null>(null);

	useEffect(() => {
		const init = async () => {
			// TODO: change the network and provider logic here
			const networkId = await getDefaultNetworkId();

			const provider = loadProvider({
				networkId,
				//infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
				provider: window.ethereum,
			});

			setNetwork(newNetwork);
			setProvider(provider);
			setAppReady(true);
		};

		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isAppReady && network) {
			const onboard = initOnboard(synthetixjs!, network.id, {
				address: setWalletAddress,
				network: (networkId: number) => {
					const isSupportedNetwork =
						chainIdToNetwork != null && chainIdToNetwork[networkId as NetworkId] ? true : false;

					if (isSupportedNetwork) {
						const provider = loadProvider({
							provider: onboard.getState().wallet.provider,
						});
						const signer = provider.getSigner();
						const useOvm = getIsOVM(networkId);

						const snxjs = synthetix({ provider, networkId, signer, useOvm });

						onboard.config({ networkId });
						if (transactionNotifier) {
							transactionNotifier.setProvider(provider);
						} else {
							setTransactionNotifier(new TransactionNotifier(provider));
						}
						setProvider(provider);
						setSynthetixjs(snxjs);
						setSigner(signer);
						setNetwork({
							id: networkId as NetworkId,
							// @ts-ignore
							name: chainIdToNetwork[networkId] as NetworkName,
							useOvm,
						});
					}
				},
				wallet: async (wallet: OnboardWallet) => {
					if (wallet.provider) {
						// TODO update
						const provider = loadProvider({ provider: wallet.provider });
						const network = await provider.getNetwork();
						const networkId = network.chainId as NetworkId;

						const snxjs = synthetix({ provider, networkId, signer: provider.getSigner(), useOvm });

						setProvider(provider);
						setSigner(provider.getSigner());
						setSynthetixjs(snxjs);
						setNetwork({
							id: networkId,
							name: chainIdToNetwork[networkId] as NetworkName,
							useOvm,
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
	};
};

const Connector = createContainer(useConnector);

export default Connector;
