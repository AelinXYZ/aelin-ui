import { FC, ReactNode, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

type AppLayoutProps = {
	children: ReactNode;
};

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
	return (
		<>
			<Content>{children}</Content>
		</>
	);
};

const Content = styled.div`
	max-width: 1200px;
	margin: 0 auto;
`;

export default AppLayout;
