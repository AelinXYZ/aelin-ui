import Image from 'next/image';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { CopyToClipboard as CopyToClipboardComponent } from 'react-copy-to-clipboard';

import { Tooltip, FlexDiv } from 'components/common';

import CopyIcon from 'assets/svg/copy.svg';
import CheckIcon from 'assets/svg/check.svg';

interface ICopyToClipboard {
	text: string;
}

const CopyToClipboard = ({ text }: ICopyToClipboard) => {
	const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

	useEffect(() => {
		if (!copiedAddress) return;

		const intervalId = setInterval(() => {
			setCopiedAddress(false);
		}, 3000); // 3s

		return () => clearInterval(intervalId);
	}, [copiedAddress]);

	return (
		<Tooltip
			hideOnClick={false}
			arrow={true}
			placement="top"
			content={copiedAddress ? 'Copied' : 'Copy'}
		>
			<CopyClipboardContainer>
				<CopyToClipboardComponent text={text} onCopy={() => setCopiedAddress(true)}>
					{copiedAddress ? (
						<StyledImage width={16} height={16} src={CheckIcon} alt="copied" />
					) : (
						<StyledImage width={16} height={16} src={CopyIcon} alt={`copy ${text}`} />
					)}
				</CopyToClipboardComponent>
			</CopyClipboardContainer>
		</Tooltip>
	);
};

const StyledImage = styled(Image)`
	cursor: pointer;
	margin: 0 3px !important;
`;

const CopyClipboardContainer = styled(FlexDiv)`
	color: ${(props) => props.theme.colors.black};
	cursor: pointer;
	margin-right: 2px;
`;

export { CopyToClipboard };
export default CopyToClipboard;
