import Image from 'next/image';
import styled from 'styled-components';
import React, { FC, useEffect } from 'react';
import router, { useRouter } from 'next/router';

import { DEFAULT_PAGE_INDEX } from 'constants/defaults';

import LeftArrowIcon from 'assets/svg/caret-left.svg';
import LeftEndArrowIcon from 'assets/svg/caret-left-end.svg';
import RightArrowIcon from 'assets/svg/caret-right.svg';
import RightEndArrowIcon from 'assets/svg/caret-right-end.svg';

import { GridDivCenteredCol, resetButtonCSS } from '../common';

type PaginationProps = {
	pageIndex: number;
	pageCount: number;
	canNextPage: boolean;
	canPreviousPage: boolean;
	setPage: (page: number) => void;
	previousPage: () => void;
	nextPage: () => void;
};

const Pagination: FC<PaginationProps> = ({
	pageIndex,
	pageCount,
	canNextPage = true,
	canPreviousPage = true,
	setPage,
	nextPage,
	previousPage,
}) => {
	const { pathname } = useRouter();

	useEffect(() => {
		if (pageCount === 0) return;

		const page = pageIndex > pageCount ? DEFAULT_PAGE_INDEX : pageIndex;

		router.push({
			pathname,
			query: { page },
		});

		setPage(page - 1);
	}, [pageIndex, pageCount, pathname, setPage]);

	return (
		<PaginationContainer className="table-pagination">
			<span>
				<ArrowButton onClick={() => setPage(0)} disabled={!canPreviousPage}>
					<Image alt="" src={LeftEndArrowIcon} />
				</ArrowButton>
				<ArrowButton onClick={() => previousPage()} disabled={!canPreviousPage}>
					<Image alt="" src={LeftArrowIcon} />
				</ArrowButton>
			</span>
			<PageInfo>{`Page ${pageIndex} of ${pageCount}`}</PageInfo>
			<span>
				<ArrowButton onClick={() => nextPage()} disabled={!canNextPage}>
					<Image alt="" src={RightArrowIcon} />
				</ArrowButton>
				<ArrowButton onClick={() => setPage(pageCount - 1)} disabled={!canNextPage}>
					<Image alt="" src={RightEndArrowIcon} />
				</ArrowButton>
			</span>
		</PaginationContainer>
	);
};

const PageInfo = styled.span`
	color: ${(props) => props.theme.colors.black};
`;

const PaginationContainer = styled(GridDivCenteredCol)`
	margin-top: 12px;
	grid-template-columns: auto 1fr auto;
	background-color: ${(props) => props.theme.colors.grey};
	padding: 13px 12px;
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
	justify-items: center;
	font-size: 1rem;
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
