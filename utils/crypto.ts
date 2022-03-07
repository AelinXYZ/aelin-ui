import { ethers } from 'ethers';
import { erc20Abi } from 'contracts/erc20';

export const truncateAddress = (address: string, first = 5, last = 5) =>
	`${address.slice(0, first)}...${address.slice(-last, address.length)}`;

export const formatGwei = (wei: number) => wei / 1e8 / 10;

export const getERC20Data = async ({
	address,
	provider,
}: {
	address: string;
	provider: ethers.providers.Provider | undefined;
}) => {
	const contract = new ethers.Contract(address, erc20Abi, provider || ethers.getDefaultProvider());

	const [name, symbol, decimals, totalSupply] = await Promise.all([
		contract.name(),
		contract.symbol(),
		contract.decimals(),
		contract.totalSupply(),
	]).catch(() => []);

	return { name, symbol, decimals, totalSupply };
};
