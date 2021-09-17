import { FC, ReactNode, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

type GlobalLayoutProps = {
	children: ReactNode;
};

const GlobalLayout: FC<GlobalLayoutProps> = ({ children }) => {
	return (
		<>
			<GlobalStyle />
			{children}
		</>
	);
};

const GlobalStyle = createGlobalStyle`
body {
	background-color: ${(props) => props.theme.colors.background};
	color: ${(props) => props.theme.colors.black}
}
`;

export default GlobalLayout;
