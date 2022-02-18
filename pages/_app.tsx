import { FC, useState } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import '../styles/globals.css';
import themeConfig, { ThemeMode } from 'styles/theme';
import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/defaults';
import { GlobalLayout, AppLayout } from 'sections/Layout';
import Connector from 'containers/Connector';
import UI from 'containers/UI';
import ContractsInterface from 'containers/ContractsInterface';
import BlockExplorer from 'containers/BlockExplorer';
import TransactionNotifier from 'containers/TransactionNotifier';
import TransactionData from 'containers/TransactionData';
import NotificationContainer from 'components/NotificationContainer';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchInterval: DEFAULT_REQUEST_REFRESH_INTERVAL,
		},
	},
});

const InnerApp: FC<AppProps> = ({ Component, pageProps }) => {
	const { theme } = UI.useContainer();
	const themeColors = theme === ThemeMode.LIGHT ? themeConfig.lightTheme : themeConfig.darkTheme;
	return (
		<ThemeProvider theme={{ colors: themeColors, fonts: themeConfig.fonts }}>
			<GlobalLayout>
				<AppLayout>
					<Component {...pageProps} />
					<NotificationContainer />
				</AppLayout>
				<div id="modal-root"></div>
			</GlobalLayout>
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
