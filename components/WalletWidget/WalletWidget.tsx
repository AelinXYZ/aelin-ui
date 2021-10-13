import { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';

import { truncateAddress } from 'utils/crypto';
import Connector from 'containers/Connector';
import { FlexDivCentered, FlexDiv } from 'components/common';
import { zIndex } from 'constants/ui';

import { DesktopWalletModal } from './DesktopWalletModal';

const WalletWidget: FC = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const { network, walletAddress } = Connector.useContainer();
	return (
		<Container>
			<FlexDivCentered>
				<FlexDiv>
					<DropdownContainer>
						<OutsideClickHandler onOutsideClick={() => setIsModalOpen(false)}>
							{walletAddress == null ? (
								<FlexDivCentered>
									<Dot isActive={false} />
									<div>Connect</div>
								</FlexDivCentered>
							) : (
								<>
									<FlexDivCentered>
										<Dot isActive={true} />
										<Address>{truncateAddress(walletAddress)}</Address>
									</FlexDivCentered>
									<NetworkTag className="network-tag" data-testid="network-tag">
										{network.name}
									</NetworkTag>
								</>
							)}
							{isModalOpen && <DesktopWalletModal onDismiss={() => setIsModalOpen(false)} />}
						</OutsideClickHandler>
					</DropdownContainer>
				</FlexDiv>
			</FlexDivCentered>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 160px;
	background-color: ${(props) => props.theme.colors.grey};
	border-radius: 100px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	height: 35px;
	padding: 12px 30px;
	position: ;
`;

const DropdownContainer = styled.div`
	width: 185px;
	height: 32px;
	position: relative;

	> div {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		z-index: ${zIndex.DROPDOWN};
		width: inherit;
	}
`;

const Dot = styled.div<{ isActive: boolean }>`
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: ${(props) =>
		props.isActive ? props.theme.colors.success : props.theme.colors.statusRed};
`;

const NetworkTag = styled(FlexDivCentered)`
	background: ${(props) => props.theme.colors.grey};
	font-size: 10px;
	font-family: ${(props) => props.theme.fonts.ASMRegular};
	padding: 2px 5px;
	border-radius: 100px;
	height: 18px;
	text-align: center;
	justify-content: center;
	text-transform: uppercase;
`;

const WalletButton = styled.button<{ isActive: boolean }>`
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
	border: 1px solid ${(props) => props.theme.colors.mediumBlue};

	svg {
		margin-left: 5px;
		width: 10px;
		height: 10px;
		color: ${(props) => props.theme.colors.gray};
		${(props) =>
			props.isActive &&
			css`
				color: ${(props) => props.theme.colors.white};
			`}
	}
	&:hover {
		${NetworkTag} {
			background: ${(props) => props.theme.colors.navy};
		}
	}
`;

const Address = styled.div`
	font-size: 12px;
	margin-top: 2px;
`;

export default WalletWidget;
