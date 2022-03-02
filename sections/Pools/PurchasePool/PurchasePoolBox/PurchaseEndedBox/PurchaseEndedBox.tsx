import styled from 'styled-components';

const PurchaseEndedBox = () => (
	<>
		<Title>Investment window has closed!</Title>
		<p>
			The sponsor is looking for a deal. If a deal is found, investors will be able to either accept
			or withdraw their tokens.
		</p>
	</>
);

const Title = styled.h3`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	font-weight: 400;
	margin-top: 0;
`;

export default PurchaseEndedBox;
