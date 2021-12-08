import { FC } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import { FlexDivCenterAligned } from 'components/common';
import CopyToClipboard from 'components/CopyToClipboard';

import MetamaskIcon from 'assets/svg/metamask.svg';

import { truncateAddress } from 'utils/crypto';

interface SectionTitleProps {
	address: string | null;
	title: string;
	addToMetamask?: boolean;
}

const SectionTitle: FC<SectionTitleProps> = ({ address, title, addToMetamask }) => {
	return (
		<FlexDivCenterAligned>
			{title}
			{address != null ? (
				<>
					<AddressWidget>{truncateAddress(address)}</AddressWidget>
					<CopyToClipboard text={address} />
					{addToMetamask && typeof window !== 'undefined' && window.ethereum && (
						<Image
							width={20}
							height={20}
							alt="Add to metamask"
							onClick={() => {
								window.ethereum?.request({
									method: 'wallet_watchAsset',
									params: {
										type: 'ERC20',
										options: {
											address: address,
											symbol: 'aeD-TODO',
											decimals: 18,
											image: '',
										},
									},
								});
							}}
							src={MetamaskIcon}
						/>
					)}
				</>
			) : null}
		</FlexDivCenterAligned>
	);
};

const AddressWidget = styled.div`
	width: 115px;
	height: 22px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-radius: 100px;
	font-size: 11px;
	color: ${(props) => props.theme.colors.headerGrey};
	text-align: center;
	margin-left: 10px;
	margin-right: 10px;
	padding-top: 5px;
`;

export default SectionTitle;
