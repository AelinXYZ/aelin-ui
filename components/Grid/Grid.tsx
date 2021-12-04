import { FC } from 'react';
import { FormikErrors } from 'formik';
import styled, { css } from 'styled-components';
interface IWhitelist {
	address: string;
	amount: number | null;
}

export type GridItem = {
	header: string | JSX.Element;
	subText: string | number | JSX.Element;
	formField?: JSX.Element;
	formError?: string  | null | undefined | any[];
};

interface GridProps {
	gridItems: GridItem[];
	hasInputFields: boolean;
}

const Grid: FC<GridProps> = ({ gridItems, hasInputFields }) => {
	return (
		<Container>
			{gridItems.map(({ header, subText, formField, formError }: GridItem, idx: number) => (
				<GridItem
					gridSize={gridItems.length <= 9 ? 9 : 12}
					hasInputFields={hasInputFields}
					key={`${header}-${idx}`}
				>
					<GridItemHeader>{header}</GridItemHeader>
					<GridItemSubText>{subText}</GridItemSubText>
					{formField}
					<ErrorField>{formError}</ErrorField>
				</GridItem>
			))}
		</Container>
	);
};

const Container = styled.div`
	display: grid;
	grid-template-columns: auto auto auto;
	margin-right: 20px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-radius: 8px;
`;

const GridItem = styled.div<{ hasInputFields: boolean; gridSize: number }>`
	background-color: ${(props) => props.theme.colors.cell};
	border-bottom: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-right: 1px solid ${(props) => props.theme.colors.buttonStroke};
	padding: 20px;
	height: ${(props) => (props.hasInputFields ? '145px' : '97px')};
	min-width: 207px;
	display: flex;
	flex-direction: column;
	${(props) =>
		props.gridSize === 9 &&
		css`
			&:nth-child(3n) {
				border-right: none;
			}
			&:nth-child(1) {
				border-radius: 8px 0 0 0;
			}
			&:nth-child(3) {
				border-radius: 0 8px 0 0;
			}
			&:nth-child(7) {
				border-bottom: none;
				border-radius: 0 0 0 8px;
			}
			&:nth-child(8) {
				border-bottom: none;
			}
			&:nth-child(9) {
				border-bottom: none;
				border-radius: 0 0 8px 0;
			}
		`}
	${(props) =>
		props.gridSize === 12 &&
		css`
			&:nth-child(3n) {
				border-right: none;
			}
			&:nth-child(1) {
				border-radius: 8px 0 0 0;
			}
			&:nth-child(3) {
				border-radius: 0 8px 0 0;
			}
			&:nth-child(10) {
				border-bottom: none;
				border-radius: 0 0 0 8px;
			}
			&:nth-child(11) {
				border-bottom: none;
			}
			&:nth-child(12) {
				border-bottom: none;
				border-radius: 0 0 8px 0;
			}
		`}
`;

const GridItemHeader = styled.div`
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 12px;
`;

const GridItemSubText = styled.div`
	color: ${(props) => props.theme.colors.black};
	font-size: 12px;
	margin-bottom: 15px;
`;

const ErrorField = styled.div`
	color: ${(props) => props.theme.colors.statusRed};
	margin-top: 5px;
	font-size: 13px;
	font-weight: bold;
`;

export default Grid;
