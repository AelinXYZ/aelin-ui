import { ethers } from 'ethers';
import { NetworkId } from 'constants/networks';
import type { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
	interface Window {
		web3?: {
			eth?: {
				net: {
					getId: () => NetworkId;
				};
			};
			version: {
				getNetwork(cb: (err: Error | undefined, networkId: NetworkId) => void): void;
				network: NetworkId;
			};
		};
		ethereum?: MetaMaskInpageProvider;
	}
}
