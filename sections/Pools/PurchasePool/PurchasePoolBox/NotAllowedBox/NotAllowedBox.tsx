import styled from 'styled-components';

const NotAllowedBox = () => (
	<>
		<Title>Private pool</Title>
		<p>This address is not part of the allowlist.</p>
	</>
);

const Title = styled.h3`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	font-weight: 400;
	margin-top: 0;
`;

export default NotAllowedBox;
