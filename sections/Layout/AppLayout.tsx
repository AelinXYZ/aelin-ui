import { FC, ReactNode, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import Footer from '../Footer';

type AppLayoutProps = {
	children: ReactNode;
};

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
	return (
		<Container>
			<Content>{children}</Content>
			<Footer />
		</Container>
	);
};

const Container = styled.div`
	position: relative;
`;

const Content = styled.div`
	max-width: 100vw;
	min-height: 100vh;
`;

export default AppLayout;
