//@ts-nocheck
import React, { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled, { css } from 'styled-components';
import { useTable, useFlexLayout, useSortBy, Column, Row, usePagination, Cell } from 'react-table';

import DarkSpinner from 'assets/svg/loader-dark.svg';
import LightSpinner from 'assets/svg/loader-light.svg';

import UI from 'containers/UI';

import { ThemeMode } from 'styles/theme';

import ROUTES from 'constants/routes';
import { DEFAULT_DECIMALS, MAX_RESULTS_PER_PAGE } from 'constants/defaults';

import { FlexDivCentered } from '../common';

import Pagination from './Pagination';
import { SortArrows } from 'components/Svg';
import { addTransparency } from 'styles/theme/colors';
import { formatNumber } from 'utils/numbers';
import { ethers } from 'ethers';
import { isAfter } from 'date-fns';

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

	const { theme } = UI.useContainer();

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
												<StyledSortArrows sort={column.isSortedDesc ? 'desc' : 'asc'} />
											) : (
												<StyledSortArrows />
											)}
										</SortIconContainer>
									)}
								</TableCellHead>
							))}
						</TableRow>
					))}
					{isLoading ? (
						<SpinnerWrapper>
							<Image
								src={theme === ThemeMode.LIGHT ? LightSpinner : DarkSpinner}
								alt="Loading..."
							/>
						</SpinnerWrapper>
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
										href={ROUTES.Pools.PoolView(
											`${row?.original?.id}/${row?.original?.network}` ?? ''
										)}
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

const StyledSortArrows = styled(SortArrows)<{ sort?: string }>`
	& #up {
		fill: ${(props) =>
			props.sort
				? props.sort === 'asc'
					? props.theme.colors.black
					: addTransparency('BF', props.theme.colors.tablePrimary)
				: addTransparency('BF', props.theme.colors.tablePrimary)};
	}

	& #down {
		fill: ${(props) =>
			props.sort
				? props.sort === 'desc'
					? props.theme.colors.black
					: addTransparency('BF', props.theme.colors.tablePrimary)
				: addTransparency('BF', props.theme.colors.tablePrimary)};
	}
`;

const TableContainer = styled.div`
	overflow: auto;
`;

const SpinnerWrapper = styled.div`
	display: flex;
	justify-content: center;
	padding: 30px;
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
	font-weight: bold;
	user-select: none;
	&:last-child {
		padding-left: 10px;
	}
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
	border: 1px solid ${(props) => props.theme.colors.tableBorders};
	border-top: none;

	${(props) =>
		props.palette === 'primary' &&
		css`
			${TableBody} {
				max-height: calc(100% - ${CARD_HEIGHT});
			}
			${TableCell} {
				font-size: 1rem;
				justify-content: left;
				height: ${CARD_HEIGHT};
				border-top: 1px solid ${(props) => props.theme.colors.tableBorders};
				font-family: ${(props) => props.theme.fonts.ASMRegular};
				padding-right: 5px;
			}
			${TableRow} {
				cursor: pointer;
				color: ${(props) => props.theme.colors.textBody};
				&:nth-child(even) {
					background-color: ${(props) => props.theme.colors.tablePrimary};
				}
				&:nth-child(odd) {
					background-color: ${(props) => props.theme.colors.tableSecondary};
				}
				&:hover {
					background-color: ${(props) => props.theme.colors.tableHover};
					color: ${(props) => props.theme.colors.textHover};
				}
			}
			${TableCellHead} {
				font-family: ${(props) => props.theme.fonts.ASMRegular};
				color: ${(props) => props.theme.colors.tableHeaderText};
				background-color: ${(props) => props.theme.colors.primary};
				text-transform: capitalize;
				font-size: 1rem;
			}
			${TableBodyRow} {
				background-color: ${(props) => props.theme.colors.tablePrimary};
				&:last-child {
					border-bottom: 0;
				}
			}
		`}
`;

const toNumber = (value: string, purchaseTokenDecimals: string): number =>
	Number(
		formatNumber(
			ethers.utils.formatUnits(value, purchaseTokenDecimals).toString(),
			DEFAULT_DECIMALS
		).replaceAll(',', '')
	);

export const sortByBn = (rowA: Row, rowB: Row, id: number) => {
	if (
		toNumber(rowA.values[id].toString(), rowA.original.purchaseTokenDecimals) >
		toNumber(rowB.values[id].toString(), rowB.original.purchaseTokenDecimals)
	)
		return 1;
	if (
		toNumber(rowB.values[id].toString(), rowB.original.purchaseTokenDecimals) >
		toNumber(rowA.values[id].toString(), rowA.original.purchaseTokenDecimals)
	)
		return -1;
	return 0;
};

export const sortByFee = (rowA: Row, rowB: Row, id: number) => {
	if (
		Number(ethers.utils.formatEther(rowA.values[id].toString())) >
		Number(ethers.utils.formatEther(rowB.values[id].toString()))
	)
		return 1;
	if (
		Number(ethers.utils.formatEther(rowB.values[id].toString())) >
		Number(ethers.utils.formatEther(rowA.values[id].toString()))
	)
		return -1;
	return 0;
};

export const sortByPurchaseExpiry = (rowA: Row, rowB: Row, id: number) => {
	var a = new Date(rowA.values[id]);
	var b = new Date(rowB.values[id]);

	if (
		Number(
			ethers.utils
				.formatUnits(rowA.original.cap.toString(), rowA.original.purchaseTokenDecimals)
				.toString()
		) ===
			Number(
				ethers.utils
					.formatUnits(rowA.original.contributions.toString(), rowA.original.purchaseTokenDecimals)
					.toString()
			) &&
		Number(
			ethers.utils
				.formatUnits(rowA.original.cap.toString(), rowA.original.purchaseTokenDecimals)
				.toString()
		) !== 0
	) {
		return 1;
	}

	if (isAfter(a, b)) {
		return 1;
	}
	return -1;
};

export const sortByPrivacy = (rowA: Row, rowB: Row, id: number) => {
	return rowA.values[id] ? 1 : -1;
};

export default Table;
