//@ts-nocheck
import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import Link from 'next/link';
import { useTable, useFlexLayout, useSortBy, Column, Row, usePagination, Cell } from 'react-table';
import Image from 'next/image';
import ROUTES from 'constants/routes';

import SortDownIcon from 'assets/svg/caret-down.svg';
import SortUpIcon from 'assets/svg/caret-up.svg';

import { FlexDivCentered } from '../common';
import { MAX_RESULTS_PER_PAGE } from 'constants/defaults';

import Spinner from 'assets/svg/loader.svg';
import Pagination from './Pagination';

export type TablePalette = 'primary';

const CARD_HEIGHT = '70px';

type ColumnWithSorting<D extends object = {}> = Column<D> & {
	sortType?: string | ((rowA: Row<any>, rowB: Row<any>) => -1 | 1);
	sortable?: boolean;
};

type TableProps = {
	pageIndex: number;
	columns: ColumnWithSorting<object>[];
	data: object[];
	hasLinksToPool: boolean;
	options?: any;
	noResultsMessage?: React.ReactNode;
	palette?: TablePalette;
	isLoading?: boolean;
	className?: string;
	showPagination?: boolean;
	maxRows?: number;
};

export const Table: FC<TableProps> = ({
	pageIndex,
	columns = [],
	data = [],
	hasLinksToPool = false,
	options = {},
	noResultsMessage = null,
	palette = 'primary',
	isLoading = false,
	className,
	showPagination = false,
	maxRows = MAX_RESULTS_PER_PAGE,
}) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		// @ts-ignore
		page,
		prepareRow,
		// @ts-ignore
		canPreviousPage,
		// @ts-ignore
		canNextPage,
		// @ts-ignore
		pageCount,
		// @ts-ignore
		gotoPage,
		// @ts-ignore
		nextPage,
		// @ts-ignore
		previousPage,
		// @ts-ignore
		state: { pageIndex: pageIndexState },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: pageIndex - 1, pageSize: showPagination ? maxRows : data.length },
			...options,
		},
		useSortBy,
		usePagination,
		useFlexLayout
	);

	return (
		<>
			<TableContainer>
				<ReactTable {...getTableProps()} palette={palette} className={className}>
					{headerGroups.map((headerGroup, idx) => (
						<TableRow key={idx} className="table-row" {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column: any, idx: number) => (
								<TableCellHead
									key={idx}
									{...column.getHeaderProps(
										column.sortable ? column.getSortByToggleProps() : undefined
									)}
									className="table-header-cell"
								>
									{column.render('Header')}
									{column.sortable && (
										<SortIconContainer>
											{column.isSorted ? (
												column.isSortedDesc ? (
													<StyledSortIcon alt="" src={SortDownIcon} />
												) : (
													<StyledSortIcon alt="" src={SortUpIcon} />
												)
											) : (
												<>
													<StyledSortIcon alt="" src={SortUpIcon} />
													<StyledSortIcon alt="" src={SortDownIcon} />
												</>
											)}
										</SortIconContainer>
									)}
								</TableCellHead>
							))}
						</TableRow>
					))}
					{isLoading ? (
						<StyledSpinner src={Spinner} />
					) : page.length > 0 ? (
						<TableBody className="table-body" {...getTableBodyProps()}>
							{page.map((row: Row, i: number) => {
								prepareRow(row);
								const classNames = ['table-body-row'];
								const tableBodyRow = (
									<TableBodyRow className={classNames.join(' ')} {...row.getRowProps()}>
										{row.cells.map((cell: Cell, idx) => (
											<TableCell
												key={`cell-${idx}`}
												className="table-body-cell"
												{...cell.getCellProps()}
											>
												{cell.render('Cell')}
											</TableCell>
										))}
									</TableBodyRow>
								);
								return hasLinksToPool ? (
									<Link
										key={`tableRowLink-${i}`}
										// @ts-ignore
										href={ROUTES.Pools.PoolView(row?.original?.id ?? '')}
									>
										{tableBodyRow}
									</Link>
								) : (
									tableBodyRow
								);
							})}
						</TableBody>
					) : null}
				</ReactTable>
			</TableContainer>
			{(!data || data.length === 0) && <NoResultsContainer>{noResultsMessage}</NoResultsContainer>}

			{showPagination && (
				<Pagination
					pageIndex={pageIndexState + 1}
					pageCount={pageCount}
					canNextPage={canNextPage}
					canPreviousPage={canPreviousPage}
					setPage={gotoPage}
					previousPage={previousPage}
					nextPage={nextPage}
				/>
			)}
		</>
	);
};

const TableContainer = styled.div`
	overflow: auto;
`;

// @ts-ignore
const StyledSpinner = styled(Image)`
	display: block;
	margin: 30px auto;
`;

export const TableRow = styled.div``;

const TableBody = styled.div`
	overflow-y: auto;
	overflow-x: hidden;
`;

const TableBodyRow = styled(TableRow)`
	cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
`;

const TableCell = styled(FlexDivCentered)`
	box-sizing: border-box;
	&:first-child {
		padding-left: 18px;
	}
	&:last-child {
		padding-right: 18px;
	}
`;

const TableCellHead = styled(TableCell)`
	user-select: none;
`;

const SortIconContainer = styled.span`
	display: flex;
	margin-left: 5px;
	flex-direction: column;
`;

const NoResultsContainer = styled.div`
	height: 150px;
	text-align: center;
	padding-top: 70px;
`;

const ReactTable = styled.div<{ palette: TablePalette }>`
	width: 100%;
	height: 100%;
	overflow-x: auto;
	position: relative;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-top: none;

	${(props) =>
		props.palette === 'primary' &&
		css`
			${TableBody} {
				max-height: calc(100% - ${CARD_HEIGHT});
			}
			${TableCell} {
				font-size: 1rem;
				justify-content: center;
				height: ${CARD_HEIGHT};
				border-top: 1px solid ${(props) => props.theme.colors.buttonStroke};
				font-family: ${(props) => props.theme.fonts.ASMRegular};
			}
			${TableRow} {
				cursor: pointer;
				color: ${(props) => props.theme.colors.black};
				&:nth-child(even) {
					background-color: ${(props) => props.theme.colors.grey};
				}
				&:nth-child(odd) {
					background-color: ${(props) => props.theme.colors.cell};
				}
				&:hover {
					background-color: ${(props) => props.theme.colors.lightGreen};
					color: ${(props) => props.theme.colors.black};
				}
			}
			${TableCellHead} {
				color: ${(props) => props.theme.colors.headerGrey};
				font-family: ${(props) => props.theme.fonts.ASMRegular};
				color: ${(props) => props.theme.colors.white};
				background-color: ${(props) => props.theme.colors.forestGreen};
				text-transform: capitalize;
				font-size: 1rem;
			}
			${TableBodyRow} {
				background-color: ${(props) => props.theme.colors.grey};
				&:last-child {
					border-bottom: 0;
				}
			}
		`}
`;

const StyledSortIcon = styled(Image)`
	width: 5px;
	height: 5px;
	color: ${(props) => props.theme.colors.black};
`;

export default Table;
