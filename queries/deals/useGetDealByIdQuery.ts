import { utils } from 'ethers';
import { getGraphEndpoint } from 'constants/endpoints';
import { DealCreatedResult, useGetDealCreatedById } from '../../subgraph';
import { NetworkId } from 'constants/networks';

const useGetDealByIdQuery = ({ id, networkId }: { id: string; networkId?: NetworkId }) =>
	useGetDealCreatedById(
		getGraphEndpoint(networkId),
		{
			id,
		},
		{
			id: true,
			name: true,
			symbol: true,
			sponsor: true,
			poolAddress: true,
		},
		{},
		networkId ? networkId : NetworkId['Optimism-Mainnet']
	);

export const parseDeal = (deal: DealCreatedResult) => {
	let name = '';
	let symbol = '';
	try {
		name = utils.parseBytes32String(deal.name.split('-')[1]);
		symbol = utils.parseBytes32String(deal.symbol.split('-')[1]);
	} catch (e) {
		name = deal.name.split('-')[1];
		symbol = deal.symbol.split('-')[1];
	}
	return {
		...deal,
		name,
		symbol,
	};
};

export default useGetDealByIdQuery;
