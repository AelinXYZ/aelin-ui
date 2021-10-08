import { FC } from 'react';
import styled from 'styled-components';
import { truncateAddress } from 'utils/crypto';

const WalletWidget: FC = () => {
	return (
		<Container>
			<Dot />
			<Address>{truncateAddress('0x4069e799Da927C06b430e247b2ee16C03e8B837d')}</Address>
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
