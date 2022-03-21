import styled from 'styled-components';
import Image from 'next/image';
import { ThemeMode } from 'styles/theme';
import DarkSpinner from 'assets/svg/loader-dark.svg';
import LightSpinner from 'assets/svg/loader-light.svg';
import UI from 'containers/UI';

const PageLoading = () => {
	const { theme } = UI.useContainer();
	return (
		<Container>
			<Image src={theme === ThemeMode.LIGHT ? LightSpinner : DarkSpinner} alt="Loading..." />
			<MessageWrapper>Loading</MessageWrapper>
		</Container>
	);
};

const Container = styled.div`
	flex-direction: column;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 10%;
`;
const MessageWrapper = styled.div`
	font-size: 1.15rem;
	margin-top: 20px;
`;
export default PageLoading;
