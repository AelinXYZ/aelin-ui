import { isEns, useAddressesToEns } from 'hooks/useEns';
import { FC } from 'react';
import { truncateAddress } from 'utils/crypto';

const Ens: FC<{ address: string }> = ({ address }) => {
	const [ensName] = useAddressesToEns([address]);
	const hasEnsName = isEns(ensName);
	return <>{hasEnsName ? ensName : truncateAddress(address)}</>;
};

export default Ens;
