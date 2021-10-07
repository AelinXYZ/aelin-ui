import { FC } from 'react';
import styled from 'styled-components';

export type GridItem = {
	header: string;
	text: string;
	// input?: {
	// 	type: string;
	// 	placeholder: string;
	// };
	// icon?: string; // TODO fix
};

interface GridProps {
	gridItems: GridItem[];
}

const Grid: FC<GridProps> = ({ gridItems }) => {
	return (
		<Container>
			{gridItems.map(({ header, text }: GridItem) => (
				<GridItem key={header}>
					<GridItemHeader>{header}</GridItemHeader>
					<GridItemText>{text}</GridItemText>
				</GridItem>
			))}
		</Container>
	);
};

const Container = styled.div`
	display: grid;
	grid-template-columns: auto auto auto;
`;

const GridItem = styled.div`
	background-color: ${(props) => props.theme.colors.cell};
	border-bottom: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-right: 1px solid ${(props) => props.theme.colors.buttonStroke};
	padding: 20px 0 0 20px;
	height: 78px;
	display: flex;
	flex-direction: column;
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
`;

const GridItemHeader = styled.div`
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 12px;
`;

const GridItemText = styled.div`
	color: ${(props) => props.theme.colors.textGrey};
	font-size: 14px;
`;

export default Grid;
