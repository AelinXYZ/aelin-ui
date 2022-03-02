import Image from 'next/image';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { CopyToClipboard as CopyToClipboardComponent } from 'react-copy-to-clipboard';

import { FlexDiv } from 'components/common';
import { CopyIcon } from 'components/Svg';

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
		<CopyClipboardContainer>
			<CopyToClipboardComponent text={text} onCopy={() => setCopiedAddress(true)}>
				<StyledImage />
			</CopyToClipboardComponent>
		</CopyClipboardContainer>
	);
};

const StyledImage = styled(CopyIcon)`
	cursor: pointer;
	height: 16px;
	width: 16px;
	margin: 0 3px !important;
	fill: ${(props) => props.theme.colors.paginationText};
`;

const CopyClipboardContainer = styled(FlexDiv)`
	color: ${(props) => props.theme.colors.black};
	cursor: pointer;
	margin-right: 2px;
`;

export { CopyToClipboard };
export default CopyToClipboard;
