import styled from 'styled-components';

const VestingCliffBox = () => (
	<>
		<Title>Vesting cliff</Title>
		<p>Wait for the vesting cliff to end before being able to vest your deals tokens.</p>
	</>
);

const Title = styled.h3`
	color: ${(props) => props.theme.colors.heading};
	font-size: 1.2rem;
	font-weight: 400;
	margin-top: 0;
`;

export default VestingCliffBox;
