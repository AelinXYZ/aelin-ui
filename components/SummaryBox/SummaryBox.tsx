import { FC } from 'react';
import styled from 'styled-components';

export type SummaryItem = {
	label: string;
	text: string;
};

interface SummaryBoxProps {
	header: string;
	summaryText: string;
	summaryItems: SummaryItem[];
}

const SummaryBox: FC<SummaryBoxProps> = ({ summaryText, header, summaryItems }) => {
	return (
		<Container>
			<SummaryBoxHeader>{header}</SummaryBoxHeader>
			<SummaryBoxGrid>
				{(summaryItems ?? []).map(({ label, text }, index) => (
					<Item key={`${label}-${index}`}>
						<ItemLabel>{label}:</ItemLabel>
						<ItemText>{text}</ItemText>
					</Item>
				))}
			</SummaryBoxGrid>
			<PurchaseButton type="submit">{summaryText}</PurchaseButton>
		</Container>
	);
};

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.cell};
	width: 300px;
	position: relative;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
`;

const SummaryBoxHeader = styled.div`
	padding: 20px;
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 12px;
`;

const SummaryBoxGrid = styled.div`
	display: grid;
	grid-template-columns: auto auto;
	width: 260px;
	padding: 0px 20px 5px 20px;
`;

const Item = styled.div`
	margin: 8px 0;
`;

const ItemLabel = styled.div`
	color: ${(props) => props.theme.colors.headerGrey};
	font-size: 12px;
	margin-bottom: 3px;
`;
const ItemText = styled.div`
	color: ${(props) => props.theme.colors.black};
	font-size: 12px;
`;

const PurchaseButton = styled.button`
	cursor: pointer;
	width: 100%;
	height: 56px;
	background-color: transparent;
	border: none;
	border-top: 1px solid ${(props) => props.theme.colors.buttonStroke};
	color: ${(props) => props.theme.colors.black};
	&:hover {
		background-color: ${(props) => props.theme.colors.forestGreen};
		color: ${(props) => props.theme.colors.white};
	}
	position: absolute;
	bottom: 0;
	border-radius: 0 0 8px 8px;
`;

export default SummaryBox;
