import styled, { css } from 'styled-components';
import Tippy from '@tippyjs/react';
import Image from 'next/image';

export const FlexDiv = styled.div`
	display: flex;
`;

export const FlexDivStart = styled.div`
	display: flex;
	justify-content: flex-start;
`;

export const FlexDivCol = styled.div`
	display: flex;
	flex-direction: column;
`;

export const FlexDivCenterAligned = styled.div`
	display: flex;
	align-items: center;
`;

export const FlexDivCentered = styled(FlexDiv)`
	align-items: center;
`;

export const FlexDivRow = styled(FlexDiv)`
	justify-content: space-between;
`;

export const FlexDivRowCentered = styled(FlexDivRow)`
	align-items: center;
	justify-content: center;
`;

export const FlexDivColCentered = styled(FlexDivCol)`
	align-items: center;
`;

export const GridDiv = styled.div`
	display: grid;
`;

export const GridDivCentered = styled(GridDiv)`
	align-items: center;
`;

export const GridDivCenteredCol = styled(GridDivCentered)`
	grid-auto-flow: column;
`;

export const Tooltip = styled(Tippy)`
	background: ${(props) => props.theme.colors.forestGreen};
	color: ${(props) => props.theme.colors.white};
	border-radius: 4px;
	.tippy-arrow {
		color: ${(props) => props.theme.colors.white};
	}
	.tippy-content {
		font-size: 12px;
		padding: 10px;
	}
`;

export const linkCSS = css`
	text-decoration: none;
	&:hover {
		text-decoration: none;
	}
`;

export const ExternalLink = styled.a.attrs({
	target: '_blank',
	rel: 'noreferrer noopener',
})`
	${linkCSS};
`;

export const resetButtonCSS = css`
	border: none;
	background: none;
	outline: none;
	cursor: pointer;
	padding: 0;
`;

// @ts-ignore
export const StyledSpinner = styled(Image)`
	display: block;
	margin: 30px auto;
`;

export const QuestionMark = styled.span`
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
