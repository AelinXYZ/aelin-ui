import { FC } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';

import '../styles/globals.css';
import theme from 'styles/theme';
import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/defaults';
import { GlobalLayout, AppLayout } from 'sections/Layout';
import Connector from 'containers/Connector';
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
	return (
		<GlobalLayout>
			<AppLayout>
				<Component {...pageProps} />
				<NotificationContainer />
			</AppLayout>
			<div id="modal-root"></div>
		</GlobalLayout>
	);
};

const App = (props: AppProps) => {
	return (
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={queryClient} contextSharing={true}>
				<Connector.Provider>
					<ContractsInterface.Provider>
						<BlockExplorer.Provider>
							<TransactionNotifier.Provider>
								<TransactionData.Provider>
									<InnerApp {...props} />
								</TransactionData.Provider>
							</TransactionNotifier.Provider>
						</BlockExplorer.Provider>
					</ContractsInterface.Provider>
				</Connector.Provider>
			</QueryClientProvider>
		</ThemeProvider>
	);
};

export default App;
