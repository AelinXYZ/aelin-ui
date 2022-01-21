import onboard from 'bnc-onboard';

import { Subscriptions, WalletType } from 'bnc-onboard/dist/src/interfaces';
import { Network, NetworkType } from 'constants/networks';

const getInfuraRpcURL = (networkName: Network) =>
	`https://${networkName}.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`;

export const initOnboard = (network: NetworkType, subscriptions: Subscriptions) => {
	const infuraRpc = getInfuraRpcURL(network.name);

	return onboard({
		dappId: process.env.NEXT_PUBLIC_BN_ONBOARD_API_KEY,
		hideBranding: true,
		networkId: network.id,
		subscriptions,
		darkMode: true,
		walletSelect: {
			wallets: [
				{
					name: 'Browser Wallet',
					iconSrc: '/images/browserWallet.svg',
					type: 'injected' as WalletType,
					link: 'https://metamask.io',
					wallet: async (helpers: any) => {
						const { createModernProviderInterface } = helpers;
						const provider = window.ethereum;
						return {
							provider,
							interface: provider ? createModernProviderInterface(provider) : null,
						};
					},
					preferred: true,
					desktop: true,
					mobile: true,
				},
				{
					walletName: 'walletConnect',
					rpc: { [network ? network.id : Network['Optimism-Mainnet']]: infuraRpc },
					preferred: true,
				},
				{ walletName: 'walletLink', rpcUrl: infuraRpc, preferred: true },
				{
					walletName: 'portis',
					apiKey: process.env.NEXT_PUBLIC_PORTIS_APP_ID,
				},
				{ walletName: 'gnosis' },
			],
		},
		walletCheck: [
			{ checkName: 'derivationPath' },
			{ checkName: 'accounts' },
			{ checkName: 'connect' },
		],
	});
};
