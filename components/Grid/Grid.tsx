import { FC } from 'react';
import styled from 'styled-components';

export type GridItem = {
	header: string;
	text: string;
	input?: {
		type: string;
		placeholder: string;
	};
	// icon?: string; // TODO fix
};

interface GridProps {
	gridItems: GridItem[];
	hasInputFields: boolean;
}

const Grid: FC<GridProps> = ({ gridItems, hasInputFields }) => {
	return (
		<Container>
			{gridItems.map(({ header, text, input }: GridItem) => (
				<GridItem hasInputFields={hasInputFields} key={header}>
					<GridItemHeader>{header}</GridItemHeader>
					<GridItemText>{text}</GridItemText>
					{hasInputFields && input ? (
						<GridItemInput type={input.type} placeholder={input.placeholder} />
					) : null}
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

const GridItem = styled.div<{ hasInputFields: boolean }>`
	background-color: ${(props) => props.theme.colors.cell};
	border-bottom: 1px solid ${(props) => props.theme.colors.buttonStroke};
	border-right: 1px solid ${(props) => props.theme.colors.buttonStroke};
	padding: 20px;
	height: ${(props) => (props.hasInputFields ? '125px' : '78px')};
	width: 207px;
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
	color: ${(props) => props.theme.colors.black};
	font-size: 12px;
`;

const GridItemInput = styled.input`
	outline: none;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	background-color: ${(props) => props.theme.colors.background};
	border-radius: 4px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	height: 30px;
	padding: 6px 12px;
	margin-top: 18px;
	&::placeholder {
		font-display: ${(props) => props.theme.fonts.agrandir};
		font-size: 12px;
	}
`;

export default Grid;
