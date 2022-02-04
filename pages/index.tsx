import { useRouter } from 'next/router';
import ROUTES from 'constants/routes';

const Index = () => {
	const router = useRouter();
	router.push(ROUTES.Pools.Home);
	return null;
};

export default Index;
