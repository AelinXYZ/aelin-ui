import { FC } from 'react';
import Link from 'next/link';
import { useTable, Column, Row } from 'react-table';
import styled, { css } from 'styled-components';
import ROUTES from 'constants/routes';
import Pagination from './Pagination';

type ColumnWithSorting<D extends object = {}> = Column<D> & {
	sortType?: string | ((rowA: Row<any>, rowB: Row<any>) => -1 | 1);
	sortable?: boolean;
};

type TableProps = {
	data: object[];
	columns: ColumnWithSorting<object>[];
	hasLinksToPool: boolean;
	showPagination: boolean;
	noResults: boolean;
};

const Table: FC<TableProps> = ({
	data,
	columns,
	hasLinksToPool,
	showPagination = true,
	noResults = false,
}) => {
	const {
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		// @ts-ignore
		page,
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
	} = useTable({
		columns,
		data,
	});
	return (
		<>
			<StyledTable cellSpacing="0">
				<thead>
					{headerGroups.map((headerGroup, i) => (
						<tr key={`tableRowHeader-${i}`} {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column, j) => (
								<TH key={`tableHeader-${j}`} {...column.getHeaderProps()}>
									{column.render('Header')}
								</TH>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map((row, i) => {
						prepareRow(row);
						const tableRow = (
							<TR key={`tableRowBody-${i}`} isEven={i % 2 === 0} {...row.getRowProps()}>
								{row.cells.map((cell, j) => {
									return (
										<TD key={`tableData-${j}`} {...cell.getCellProps()}>
											{cell.render('Cell')}
										</TD>
									);
								})}
							</TR>
						);
						return hasLinksToPool ? (
							<Link
								key={`tableRowLink-${i}`}
								// @ts-ignore
								href={ROUTES.Pools.PoolView(row?.original?.address ?? '')}
							>
								{tableRow}
							</Link>
						) : (
							tableRow
						);
					})}
				</tbody>
			</StyledTable>
			{noResults ? 'No results' : null}
			{showPagination ? (
				<Pagination
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

const StyledTable = styled.table`
	width: 100%;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-radius: 10px;
	tr:last-child {
		td:first-child {
			border-bottom-left-radius: 10px;
		}
		td:last-child {
			border-bottom-right-radius: 10px;
		}
	}
`;

const TR = styled.tr<{ isEven: boolean }>`
	cursor: pointer;
	${(props) =>
		props.isEven &&
		css`
			background-color: ${(props) => props.theme.colors.grey};
			color: ${(props) => props.theme.colors.black};
		`}
	&:hover {
		background-color: ${(props) => props.theme.colors.forestGreen};
		color: ${(props) => props.theme.colors.white};
	}
`;

const TH = styled.th`
	color: ${(props) => props.theme.colors.headerGrey};
	font-family: ${(props) => props.theme.fonts.ASMRegular};
	font-size: 11px;
	text-transform: capitalize;
	font-weight: 100;
	height: 34px;
`;

const TD = styled.td`
	border-top: 1px solid ${(props) => props.theme.colors.buttonStroke};
	font-family: ${(props) => props.theme.fonts.ASMRegular};
	font-size: 12px;
	padding: 0;
	height: 46px;
	text-align: center;
`;

export default Table;
