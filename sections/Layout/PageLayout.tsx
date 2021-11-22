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

const Container = styled.div`
	padding: 32px 42px;
`;

const Content = styled.div`
	margin-top: 116px;
	display: flex;
`;

export const ContentHeader = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	margin-bottom: 34px;
`;

export const ContentTitle = styled.h1`
	color: ${(props) => props.theme.colors.headerGreen};
	font-size: 20px;
	margin: 0;
`;

const ContentSubtitle = styled.p`
	margin: 6px 0 0 0;
	color: ${(props) => props.theme.colors.headerGrey};
	font-size: 15px;
`;

const ContentBody = styled.div``;

const ColCenter = styled.div`
	width: 1150px;
`;

export default PageLayout;
