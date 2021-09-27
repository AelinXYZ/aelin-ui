import { FC } from 'react';
import { useTable, Column, Row } from 'react-table';
import styled, { css } from 'styled-components';

type ColumnWithSorting<D extends object = {}> = Column<D> & {
	sortType?: string | ((rowA: Row<any>, rowB: Row<any>) => -1 | 1);
	sortable?: boolean;
};

type TableProps = {
	data: object[];
	columns: ColumnWithSorting<object>[];
};

const Table: FC<TableProps> = ({ data, columns }) => {
	const { getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
		columns,
		data,
	});
	return (
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
					return (
						<tr key={`tableRowBody-${i}`} {...row.getRowProps()}>
							{row.cells.map((cell, j) => {
								return (
									<TD key={`tableData-${j}`} isEven={i % 2 === 0} {...cell.getCellProps()}>
										{cell.render('Cell')}
									</TD>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</StyledTable>
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

const TH = styled.th`
	color: ${(props) => props.theme.colors.headerGrey};
	font-family: ${(props) => props.theme.fonts.ASMRegular};
	font-size: 11px;
	text-transform: capitalize;
	font-weight: 100;
	height: 34px;
`;

const TD = styled.td<{ isEven: boolean }>`
	border-top: 1px solid ${(props) => props.theme.colors.buttonStroke};
	font-family: ${(props) => props.theme.fonts.ASMRegular};
	color: ${(props) => props.theme.colors.black};
	font-size: 12px;
	padding: 0;
	height: 46px;
	text-align: center;
	${(props) =>
		props.isEven &&
		css`
			background-color: ${(props) => props.theme.colors.grey};
		`}
`;

export default Table;
