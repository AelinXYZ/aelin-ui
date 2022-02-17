import { FC } from 'react';
import styled from 'styled-components';
import { useState } from 'react';

import { Tooltip } from 'components/common';
import theme from 'styles/theme';

interface QuestionMarkProps {
	text: string;
	bgColor?: string;
	borderColor?: string;
	fontColor?: string;
	bold?: boolean;
}

interface IStyledQuestionMark extends Omit<QuestionMarkProps, 'text'> {}

const QuestionMark: FC<QuestionMarkProps> = ({
	text,
	bgColor = theme.colors.buttonStroke,
	fontColor = theme.colors.black,
	borderColor = theme.colors.darkGrey,
	bold = false,
}) => {
	const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

	return (
		<Tooltip visible={isTooltipOpen} allowHTML content={<div>{text}</div>}>
			<StyledQuestionMark
				bold={bold}
				bgColor={bgColor}
				fontColor={fontColor}
				borderColor={borderColor}
				onMouseEnter={() => setIsTooltipOpen(true)}
				onMouseLeave={() => setIsTooltipOpen(false)}
			>
				?
			</StyledQuestionMark>
		</Tooltip>
	);
};

const StyledQuestionMark = styled.span<IStyledQuestionMark>`
	width: 20px;
	height: 20px;
	margin: 0 5px;
	font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
	font-size: 10px;
	line-height: 20px;
	border-radius: 50%;
	margin-right: 5px;
	text-align: center;
	display: inline-block;
	cursor: pointer;
	color: ${(props) => props.fontColor};
	background: ${(props) => props.bgColor};
	border: 1px solid ${(props) => props.borderColor};
	font-family: ${(props) => props.theme.fonts.agrandir};
`;

export { QuestionMark };
export default QuestionMark;
