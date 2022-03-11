import { FC } from 'react';
import styled, { css } from 'styled-components';

export type GridItem = {
	header: string | JSX.Element;
	subText: string | number | JSX.Element;
	formField?: JSX.Element;
	formError?: string | null | undefined | any[];
};

interface GridProps {
	gridItems: GridItem[];
	hasInputFields: boolean;
	className?: string;
}

const Grid: FC<GridProps> = ({ gridItems, hasInputFields, className }) => {
	return (
		<Container className={className}>
			{gridItems.map(({ header, subText, formField, formError }: GridItem, idx: number) => (
				<GridItem
					gridSize={gridItems.length <= 9 ? 9 : 12}
					hasInputFields={hasInputFields}
					key={`${header}-${idx}`}
				>
					<TextContainer>
						<GridItemHeader>{header}</GridItemHeader>
						<GridItemSubText>{subText}</GridItemSubText>
					</TextContainer>
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
	border: 1px solid ${(props) => props.theme.colors.borders};
	border-radius: 8px;
	height: fit-content;
`;

const GridItem = styled.div<{ hasInputFields: boolean; gridSize: number }>`
	background-color: ${(props) => props.theme.colors.boxesBackground};
	border-bottom: 1px solid ${(props) => props.theme.colors.borders};
	border-right: 1px solid ${(props) => props.theme.colors.borders};
	padding: 20px;
	height: ${(props) => (props.hasInputFields ? '180px' : '135px')};
	width: 240px;
	display: flex;
	position: relative;
	flex-direction: column;
	${(props) =>
		props.gridSize === 9 &&
		css`
			&:nth-child(3n) {
				border-right: none;
			}
			&:nth-child(1) {
				border-radius: 8px 0 0 0;
				height: ${props.hasInputFields ? '195px' : '135px'};
			}
			&:nth-child(2) {
				border-radius: 8px 0 0 0;
				height: ${props.hasInputFields ? '195px' : '135px'};
			}
			&:nth-child(3) {
				border-radius: 0 8px 0 0;
				height: ${props.hasInputFields ? '195px' : '135px'};
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
				height: ${props.hasInputFields ? '195px' : '160px'};
			}
			&:nth-child(11) {
				border-bottom: none;
				height: ${props.hasInputFields ? '195px' : '160px'};
			}
			&:nth-child(12) {
				border-bottom: none;
				border-radius: 0 0 8px 0;
				height: ${props.hasInputFields ? '195px' : '160px'};
			}
		`}
`;

const GridItemHeader = styled.div`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
`;

const GridItemSubText = styled.div`
	color: ${(props) => props.theme.colors.textSmall};
	font-size: 1rem;
	margin: 5px 0;

	&:first-letter {
		text-transform: uppercase;
	}
`;

const ErrorField = styled.div`
	color: ${(props) => props.theme.colors.red};
	margin-top: 5px;
	font-size: 1rem;
	font-weight: bold;
	position: absolute;
	bottom: 10px;
`;

const TextContainer = styled.div`
	height: 80px;
`;

export default Grid;
