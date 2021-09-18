import { FC, ReactChildren } from 'react';
import styled from 'styled-components';

import Header from '../Header';

type PageLayoutProps = {
	children: ReactChildren;
};

const PageLayout: FC<PageLayoutProps> = ({ children }) => {
	return (
		<Container>
			<Header />
			<Content>{children}</Content>
		</Container>
	);
};

const Container = styled.div`
	padding: 32px 42px;
`;

const Content = styled.div`
	margin-top: 116px;
`;

export default PageLayout;
