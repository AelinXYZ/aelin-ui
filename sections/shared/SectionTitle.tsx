import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import CopyIcon from 'assets/svg/copy.svg';
import CheckIcon from 'assets/svg/check.svg';
import Image from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { truncateAddress } from 'utils/crypto';
import { FlexDivCenterAligned } from 'components/common';

interface SectionTitleProps {
	address: string;
	title: string;
}

const SectionTitle: FC<SectionTitleProps> = ({ address, title }) => {
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
			<AddressWidget>{truncateAddress(address)}</AddressWidget>
			<CopyToClipboard text={address} onCopy={() => setCopiedAddress(true)}>
				{copiedAddress ? (
					<Image src={CheckIcon} alt="copied" />
				) : (
					<Image src={CopyIcon} alt={address} />
				)}
			</CopyToClipboard>
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
