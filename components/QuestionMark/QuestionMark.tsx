import { FC } from 'react';
import styled from 'styled-components';
import { useState } from 'react';

import { Tooltip } from 'components/common';

interface QuestionMarkProps {
	text: string;
	light?: boolean;
}

const QuestionMark: FC<QuestionMarkProps> = ({ text, light }) => {
	const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

	return (
		<Tooltip visible={isTooltipOpen} allowHTML content={<div>{text}</div>}>
			<StyledQuestionMark
				light={light}
				onMouseEnter={() => setIsTooltipOpen(true)}
				onMouseLeave={() => setIsTooltipOpen(false)}
			>
				?
			</StyledQuestionMark>
		</Tooltip>
	);
};

const StyledQuestionMark = styled.span<{ light?: boolean }>`
	width: 20px;
	height: 20px;
	margin: 0 5px;
	font-weight: bold;
	font-size: 9px;
	line-height: 22px;
	border-radius: 50%;
	margin-right: 5px;
	text-align: center;
	display: inline-block;
	cursor: pointer;
	color: ${(props) => props.theme.colors.headerGreen};
	background: ${(props) => (props.light ? props.theme.colors.background : props.theme.colors.grey)};
	font-family: ${(props) => props.theme.fonts.agrandir};
`;

export { QuestionMark };
export default QuestionMark;
