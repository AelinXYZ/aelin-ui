import { isEns, useAddressToEns } from 'hooks/ens';
import { FC } from 'react';
import { truncateAddress } from 'utils/crypto';

const Ens: FC<{ address: string }> = ({ address }) => {
	const ensName = useAddressToEns(address);
	const hasEnsName = isEns(ensName);
	return <>{hasEnsName ? ensName : truncateAddress(address)}</>;
};

export default Ens;
