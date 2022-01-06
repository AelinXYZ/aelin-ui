import { FC, useState } from 'react';
import styled from 'styled-components';

import Dropdown from 'components/Dropdown';
import { truncateAddress } from 'utils/crypto';
import Connector from 'containers/Connector';

import DesktopWalletModal from './WalletModal';

const WalletWidget: FC = () => {
	const { walletAddress } = Connector.useContainer();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	return (
		<Dropdown
			isModalOpen={isModalOpen}
			setIsModalOpen={setIsModalOpen}
			content={<DesktopWalletModal onDismiss={() => setIsModalOpen(false)} />}
		>
			{walletAddress == null ? (
				<>
					<Dot isActive={false} />
					<Address>Connect</Address>
				</>
			) : (
				<>
					<>
						<Dot isActive={true} />
						<Address>{truncateAddress(walletAddress ?? '')}</Address>
					</>
				</>
			)}
		</Dropdown>
	);
};

const Dot = styled.div<{ isActive: boolean }>`
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: ${(props) =>
		props.isActive ? props.theme.colors.success : props.theme.colors.error};
`;

const Address = styled.div`
	font-size: 1rem;
	margin-top: 2px;
	margin-left: 10px;
`;

export default WalletWidget;
