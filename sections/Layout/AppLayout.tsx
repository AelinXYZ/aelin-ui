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
	max-width: 1354px;
	min-height: 100vh;
	margin: 0 auto;
`;

export default AppLayout;
