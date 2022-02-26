import styled from 'styled-components';
import React, { FC, useEffect } from 'react';
import router, { useRouter } from 'next/router';

import { DEFAULT_PAGE_INDEX } from 'constants/defaults';

import { GridDivCenteredCol, resetButtonCSS } from '../common';
import { LeftArrow, LeftEndArrow, RightArrow, RightEndArrow } from 'components/Svg';

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
					<StyledLeftEndArrow />
				</ArrowButton>
				<ArrowButton onClick={() => previousPage()} disabled={!canPreviousPage}>
					<StyledLeftArrow />
				</ArrowButton>
			</span>
			<PageInfo>{`Page ${pageIndex} of ${pageCount}`}</PageInfo>
			<span>
				<ArrowButton onClick={() => nextPage()} disabled={!canNextPage}>
					<StyledRightArrow />
				</ArrowButton>
				<ArrowButton onClick={() => setPage(pageCount - 1)} disabled={!canNextPage}>
					<StyledRightEndArrow />
				</ArrowButton>
			</span>
		</PaginationContainer>
	);
};

const PageInfo = styled.span`
	color: ${(props) => props.theme.colors.paginationText};
`;

const PaginationContainer = styled(GridDivCenteredCol)`
	margin-top: 12px;
	grid-template-columns: auto 1fr auto;
	background-color: ${(props) => props.theme.colors.tablePrimary};
	padding: 13px 12px;
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
	justify-items: center;
	font-size: 1rem;
`;

const ArrowButton = styled.button`
	${resetButtonCSS};
	padding: 4px;
	&[disabled] {
		cursor: not-allowed;
	}
`;

const StyledLeftEndArrow = styled(LeftEndArrow)`
	fill: ${(props) => props.theme.colors.paginationText};
`;

const StyledLeftArrow = styled(LeftArrow)`
	fill: ${(props) => props.theme.colors.paginationText};
`;

const StyledRightEndArrow = styled(RightEndArrow)`
	fill: ${(props) => props.theme.colors.paginationText};
`;

const StyledRightArrow = styled(RightArrow)`
	fill: ${(props) => props.theme.colors.paginationText};
`;

export default Pagination;
