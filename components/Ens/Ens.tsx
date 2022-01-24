import { FC } from 'react';

import { isEns } from 'utils/string';
import { truncateAddress } from 'utils/crypto';

import { useAddressesToEns } from 'hooks/useEns';

interface EnsProps {
	address: string;
}

const Ens: FC<EnsProps> = ({ address }) => {
	const [ensName] = useAddressesToEns([address]);

	return <>{isEns(ensName) ? ensName : truncateAddress(address)}</>;
};

export default Ens;
