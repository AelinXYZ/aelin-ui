import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ROUTES from 'constants/routes';

const Index = () => {
	const router = useRouter();
	useEffect(() => {
		router.push(ROUTES.Pools.Home);
	}, [router]);
	return null;
};

export default Index;
