import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import CopyIcon from 'assets/svg/copy.svg';
import CheckIcon from 'assets/svg/check.svg';
import MetamaskIcon from 'assets/svg/metamask.svg';
import Image from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { truncateAddress } from 'utils/crypto';
import { FlexDivCenterAligned } from 'components/common';

interface SectionTitleProps {
	address: string | null;
	title: string;
	addToMetamask?: boolean;
}

const SectionTitle: FC<SectionTitleProps> = ({ address, title, addToMetamask }) => {
	const [copiedAddress, setCopiedAddress] = useState(false);
	useEffect(() => {
		if (copiedAddress) {
			const timer1 = setInterval(() => {
				setCopiedAddress(false);
			}, 3000); // 3s
			return () => clearInterval(timer1);
		}
	}, [copiedAddress]);

	return (
		<FlexDivCenterAligned>
			{title}
			{address != null ? (
				<>
					<AddressWidget>{truncateAddress(address)}</AddressWidget>
					<CopyToClipboard text={address} onCopy={() => setCopiedAddress(true)}>
						{copiedAddress ? (
							<Image src={CheckIcon} alt="copied" />
						) : (
							<Image src={CopyIcon} alt={address} />
						)}
					</CopyToClipboard>
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
