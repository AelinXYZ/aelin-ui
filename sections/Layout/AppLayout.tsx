import { FC, ReactNode, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

type AppLayoutProps = {
	children: ReactNode;
};

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
	return (
		<Container>
			<Content>{children}</Content>
		</Container>
	);
};

const Container = styled.div`
	position: relative;
`;

const Content = styled.div`
	max-width: 100vw;
	min-height: 100vh;
	background-color: ${(props) => props.theme.colors.tableHeaderText};
`;

export default AppLayout;
