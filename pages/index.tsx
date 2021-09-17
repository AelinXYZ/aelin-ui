import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Aelin</title>
			</Head>
			<main>Aelin home page</main>

			<footer>footer</footer>
		</div>
	);
};

export default Home;
