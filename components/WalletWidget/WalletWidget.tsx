import { FC } from 'react';
import styled from 'styled-components';

const WalletWidget: FC = () => {
	return (
		<Container>
			<Dot />
			<Address>0x2D0a...1Df9</Address>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 160px;
	background-color: ${(props) => props.theme.colors.grey};
	border-radius: 100px;
	border: 1px solid ${(props) => props.theme.colors.buttonStroke};
	height: 35px;
	padding: 12px 30px;
`;

const Dot = styled.div`
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: ${(props) => props.theme.colors.success};
`;

const Address = styled.div`
	font-size: 12px;
	margin-top: 2px;
`;

export default WalletWidget;
