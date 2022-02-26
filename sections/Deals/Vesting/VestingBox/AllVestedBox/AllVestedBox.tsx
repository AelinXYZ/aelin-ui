import { FC } from 'react';
import styled from 'styled-components';

import TokenDisplay from 'components/TokenDisplay';

interface AllVestedBox {
	totalVested: number;
	underlyingDealToken: string;
}

const AllVestedBox: FC<AllVestedBox> = ({ totalVested, underlyingDealToken }) => (
	<>
		<Title>You have vested all your deal tokens</Title>

		<p>All of your deal tokens have been vested!</p>

		<p>
			Total Vested: {totalVested} <TokenDisplay address={underlyingDealToken} />
		</p>
	</>
);

const Title = styled.h3`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	font-weight: 400;
	margin-top: 0;
`;

export default AllVestedBox;
