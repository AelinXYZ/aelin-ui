import { FC, ReactChildren, ReactChild } from 'react';
import styled from 'styled-components';

import Header from '../Header';

type PageLayoutProps = {
	children: ReactChildren | ReactChild | (JSX.Element | null)[];
	title: JSX.Element;
	subtitle: string;
};

const PageLayout: FC<PageLayoutProps> = ({ children, title, subtitle }) => {
	return (
		<Container>
			<Header />
			<Content>
				<ColCenter>
					<ContentHeader>
						<ContentTitle>{title}</ContentTitle>
						<ContentSubtitle>{subtitle}</ContentSubtitle>
					</ContentHeader>
					<ContentBody>{children}</ContentBody>
				</ColCenter>
			</Content>
		</Container>
	);
};

const Container = styled.div``;

const Content = styled.div`
	max-width: 1440px;
	padding: 0 40px;
	margin: 60px auto 0 auto;
	display: flex;
`;

const ContentHeader = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const ContentTitle = styled.h1`
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 1.4rem;
	margin: 0;
`;

const ContentSubtitle = styled.p`
	margin: 6px 0 0 0;
	color: ${(props) => props.theme.colors.headerGrey};
	font-size: 1.2rem;
`;

const ContentBody = styled.div``;

const ColCenter = styled.div`
	width: 100%;
`;

export default PageLayout;
