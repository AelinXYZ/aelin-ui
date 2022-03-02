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
	solid?: boolean;
	variant?: 'table-header';
}

interface IStyledQuestionMark extends Omit<QuestionMarkProps, 'text'> {}

const QuestionMark: FC<QuestionMarkProps> = ({
	text,
	bgColor,
	fontColor,
	borderColor,
	bold = false,
	solid,
	variant,
}) => {
	const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

	return (
		<Tooltip visible={isTooltipOpen} allowHTML content={<div>{text}</div>}>
			<StyledQuestionMark
				bold={bold}
				bgColor={bgColor}
				fontColor={fontColor}
				borderColor={borderColor}
				solid={solid}
				variant={variant}
				onMouseEnter={() => setIsTooltipOpen(true)}
				onMouseLeave={() => setIsTooltipOpen(false)}
			>
				?
			</StyledQuestionMark>
		</Tooltip>
	);
};

const StyledQuestionMark = styled.span<IStyledQuestionMark>`
	min-width: 20px;
	height: 20px;
	margin: 0 5px;
	font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
	font-size: 10px;
	line-height: 18px;
	border-radius: 50%;
	margin-right: 5px;
	text-align: center;
	display: inline-block;
	cursor: pointer;
	color: ${(props) =>
		props.variant === 'table-header'
			? props.theme.colors.black
			: props.solid
			? props.theme.colors.textHover
			: props.fontColor ?? props.theme.colors.questionMarkText};
	background: ${(props) =>
		props.variant === 'table-header'
			? props.theme.colors.white
			: props.solid
			? props.theme.colors.buttonPrimary
			: props.bgColor ?? props.theme.colors.questionMarkBody};
	border: 1px solid
		${(props) =>
			props.variant === 'table-header'
				? props.theme.colors.black
				: props.solid
				? props.theme.colors.buttonPrimary
				: props.borderColor ?? props.theme.colors.questionMarkBorder};
	font-family: ${(props) => props.theme.fonts.agrandir};
`;

export { QuestionMark };
export default QuestionMark;
