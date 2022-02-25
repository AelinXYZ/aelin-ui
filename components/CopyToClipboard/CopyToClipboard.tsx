import Image from 'next/image';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { CopyToClipboard as CopyToClipboardComponent } from 'react-copy-to-clipboard';

import { FlexDiv } from 'components/common';

import CopyIconWhite from 'assets/svg/copy-white.svg';
import CopyIconBlack from 'assets/svg/copy-black.svg';
import CheckIcon from 'assets/svg/check.svg';
import UI from 'containers/UI';
import { ThemeMode } from 'styles/theme';

interface ICopyToClipboard {
	text: string;
}

const CopyToClipboard = ({ text }: ICopyToClipboard) => {
	const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
	const { theme } = UI.useContainer();

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
				{copiedAddress ? (
					<StyledImage width={16} height={16} src={CheckIcon} alt="copied" />
				) : (
					<StyledImage
						width={16}
						height={16}
						src={theme === ThemeMode.LIGHT ? CopyIconBlack : CopyIconWhite}
						alt={`copy ${text}`}
					/>
				)}
			</CopyToClipboardComponent>
		</CopyClipboardContainer>
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
