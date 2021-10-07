import { FC, ReactChild } from 'react';
import styled from 'styled-components';

import Header from '../Header';
import SearchInput from 'components/SearchInput';

type PageLayoutProps = {
	children: ReactChild;
	title: string;
	subtitle: string;
};

const PageLayout: FC<PageLayoutProps> = ({ children, title, subtitle }) => {
	return (
		<Container>
			<Header />
			<Content>
				<ColSide>
					<SearchInput />
				</ColSide>
				<ColCenter>
					<ContentHeader>
						<ContentTitle>{title}</ContentTitle>
						<ContentSubtitle>{subtitle}</ContentSubtitle>
					</ContentHeader>
					<ContentBody>{children}</ContentBody>
				</ColCenter>
				<ColSide />
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

const ContentHeader = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	margin-bottom: 34px;
`;

const ContentTitle = styled.h1`
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

const ColSide = styled.div`
	flex: 1;
`;

const ColCenter = styled.div`
	width: 940px;
`;

export default PageLayout;
