import React, { FC } from 'react';
import styled from 'styled-components';

import { GridDivCenteredCol, resetButtonCSS } from '../common';
import Image from 'next/image';

import LeftArrowIcon from 'assets/svg/caret-left.svg';
import LeftEndArrowIcon from 'assets/svg/caret-left-end.svg';
import RightArrowIcon from 'assets/svg/caret-right.svg';
import RightEndArrowIcon from 'assets/svg/caret-right-end.svg';

type PaginationProps = {
	currPage: number;
	numPages: number;
	setPage: (page: number) => void;
};

const Pagination: FC<PaginationProps> = ({ currPage, numPages, setPage }) => (
	<PaginationContainer className="table-pagination">
		<span>
			<ArrowButton onClick={() => setPage(0)} disabled={currPage === 0}>
				<Image alt="" src={LeftEndArrowIcon} />
			</ArrowButton>
			<ArrowButton onClick={() => setPage(currPage - 1)} disabled={currPage === 0}>
				<Image alt="" src={LeftArrowIcon} />
			</ArrowButton>
		</span>
		<PageInfo>{`Page ${currPage + 1} of ${numPages}`}</PageInfo>
		<span>
			<ArrowButton onClick={() => setPage(currPage + 1)} disabled={currPage === numPages - 1}>
				<Image alt="" src={RightArrowIcon} />
			</ArrowButton>
			<ArrowButton onClick={() => setPage(numPages - 1)} disabled={currPage === numPages - 1}>
				<Image alt="" src={RightEndArrowIcon} />
			</ArrowButton>
		</span>
	</PaginationContainer>
);

const PageInfo = styled.span`
	color: ${(props) => props.theme.colors.black};
`;

const PaginationContainer = styled(GridDivCenteredCol)`
	grid-template-columns: auto 1fr auto;
	background-color: ${(props) => props.theme.colors.grey};
	padding: 13px 12px;
	border-bottom-left-radius: 4px;
	border-bottom-right-radius: 4px;
	justify-items: center;
	font-size: 14px;
`;

const ArrowButton = styled.button`
	${resetButtonCSS};
	padding: 4px;
	svg {
		width: 14px;
		height: 14px;
		color: ${(props) => props.theme.colors.black};
	}
	&[disabled] {
		cursor: not-allowed;
		svg {
			color: ${(props) => props.theme.colors.black};
		}
	}
`;

export default Pagination;
