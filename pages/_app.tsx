import { FC } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';

import '../styles/globals.css';
import theme from 'styles/theme';
import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/defaults';
import { GlobalLayout, AppLayout } from 'sections/Layout';

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
			</AppLayout>
		</GlobalLayout>
	);
};

const App = (props: AppProps) => {
	return (
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={queryClient} contextSharing={true}>
				<InnerApp {...props} />
			</QueryClientProvider>
		</ThemeProvider>
	);
};

export default App;
