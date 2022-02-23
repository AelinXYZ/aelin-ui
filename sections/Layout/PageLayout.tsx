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
						{subtitle && <ContentSubtitle>{subtitle}</ContentSubtitle>}
					</ContentHeader>
					<ContentBody>{children}</ContentBody>
				</ColCenter>
			</Content>
		</Container>
	);
};

export const Container = styled.div``;

export const Content = styled.div`
	max-width: 1440px;
	padding: 0 40px 40px 40px;
	margin: 60px auto 0 auto;
	display: flex;
`;

export const SectionWrapper = styled.div`
	margin-top: 35px;
`;

export const ContentHeader = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	margin-bottom: 4rem;
`;

export const ContentTitle = styled.h1`
	color: ${(props) => props.theme.colors.heading};
	font-size: 2rem;
	font-weight: 400;
	margin: 0 0 6px 0;
`;

export const ContentSubtitle = styled.p`
	margin: 6px 0 0 0;
	color: ${(props) => props.theme.colors.textSmall};
	font-size: 1.2rem;
`;

export const ContentBody = styled.div``;

export const ColCenter = styled.div`
	width: 100%;
`;

export default PageLayout;
