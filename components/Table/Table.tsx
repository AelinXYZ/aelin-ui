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
	palette?: TablePalette;
	data: object[];
	hasLinksToPool: boolean;
	columns: ColumnWithSorting<object>[];
	options?: any;
	className?: string;
	isLoading?: boolean;
	noResultsMessage?: React.ReactNode;
	showPagination?: boolean;
	maxRows?: number;
	setIsPageOne?: (bool: boolean) => void;
};

export const Table: FC<TableProps> = ({
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
	setIsPageOne,
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
		state: { pageIndex },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageSize: showPagination ? maxRows : data.length },
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
			<NoResultsContainer>{noResultsMessage}</NoResultsContainer>
			{showPagination ? (
				<Pagination
					setIsPageOne={setIsPageOne}
					pageIndex={pageIndex}
					pageCount={pageCount}
					canNextPage={canNextPage}
					canPreviousPage={canPreviousPage}
					setPage={gotoPage}
					previousPage={previousPage}
					nextPage={nextPage}
				/>
			) : undefined}
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
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};

	${(props) =>
		props.palette === 'primary' &&
		css`
			${TableBody} {
				max-height: calc(100% - ${CARD_HEIGHT});
			}
			${TableCell} {
				font-size: 12px;
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
					background-color: ${(props) => props.theme.colors.forestGreen};
					color: ${(props) => props.theme.colors.white};
				}
			}
			${TableCellHead} {
				color: ${(props) => props.theme.colors.headerGrey};
				font-family: ${(props) => props.theme.fonts.ASMRegular};
				color: ${(props) => props.theme.colors.white};
				background-color: ${(props) => props.theme.colors.grey};
				color: ${(props) => props.theme.colors.black};
				text-transform: uppercase;
				font-size: 12px;
			}
			${TableBodyRow} {
				background-color: ${(props) => props.theme.colors.grey};
				&:last-child {
					border-bottom: 0;
				}
				&:hover {
					background-color: ${props.theme.colors.forestGreen};
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
