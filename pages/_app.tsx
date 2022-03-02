import { FC, useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import themeConfig, { ThemeMode, lightTheme, darkTheme } from 'styles/theme';

import { GlobalLayout, AppLayout } from 'sections/Layout';

import UI from 'containers/UI';
import Connector from 'containers/Connector';
import BlockExplorer from 'containers/BlockExplorer';
import TransactionData from 'containers/TransactionData';
import ContractsInterface from 'containers/ContractsInterface';
import TransactionNotifier from 'containers/TransactionNotifier';
import NotificationContainer from 'components/NotificationContainer';

import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/defaults';

import '../styles/globals.css';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchInterval: DEFAULT_REQUEST_REFRESH_INTERVAL,
		},
	},
});

const InnerApp: FC<AppProps> = ({ Component, pageProps }) => {
	const { theme } = UI.useContainer();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const themeColors = theme === ThemeMode.LIGHT ? lightTheme : darkTheme;

	return (
		<ThemeProvider theme={{ colors: themeColors, fonts: themeConfig.fonts }}>
			{isMounted && (
				<GlobalLayout>
					<AppLayout>
						<Component {...pageProps} />
						<NotificationContainer />
					</AppLayout>
					<div id="modal-root"></div>
				</GlobalLayout>
			)}
		</ThemeProvider>
	);
};

const App = (props: AppProps) => {
	return (
		<QueryClientProvider client={queryClient} contextSharing={true}>
			<Connector.Provider>
				<ContractsInterface.Provider>
					<BlockExplorer.Provider>
						<TransactionNotifier.Provider>
							<TransactionData.Provider>
								<UI.Provider>
									<InnerApp {...props} />
								</UI.Provider>
							</TransactionData.Provider>
						</TransactionNotifier.Provider>
					</BlockExplorer.Provider>
				</ContractsInterface.Provider>
			</Connector.Provider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
};

export default App;
