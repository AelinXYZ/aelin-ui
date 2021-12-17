import { FC } from 'react';
import styled from 'styled-components';
import { useState, } from 'react';

import { Tooltip } from 'components/common';

interface QuestionMarkProps {
  text: string;
};

const QuestionMark: FC<QuestionMarkProps> = ({ text }) => {
	const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

  return (
    <Tooltip
      visible={isTooltipOpen}
      appendTo="parent"
      allowHTML
      interactive
      content={
        <div>
          { text }
        </div>
      }
    >
      <StyledQuestionMark
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
      >
        ?
      </StyledQuestionMark>
    </Tooltip>
  );
};

const StyledQuestionMark = styled.span`
	width: 18px;
	height: 18px;
	margin: 0 5px;
	font-size: 9px;
	font-weight: bold;
	border-radius: 50%;
	line-height: 18px;
	margin-right: 5px;
	text-align: center;
	display: inline-block;
	cursor: pointer;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	color: ${(props) => props.theme.colors.textGrey};
	background: ${(props) => props.theme.colors.grey};
`;


export { QuestionMark }
export default QuestionMark;