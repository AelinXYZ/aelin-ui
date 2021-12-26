//@ts-nocheck
import { FC, useState, useEffect } from 'react';
import QuestionMark from 'components/QuestionMark';

import { NetworkId } from 'constants/networks';

interface CountdownProps {
	time: number;
	timeStart: number;
	networkId: NetworkId | null;
}

const Countdown: FC<CountdownProps> = ({ time, timeStart, networkId }) => {
	const calculateTimeLeft = () => {
		const now = +new Date();
		const start = timeStart != null ? +new Date(timeStart) : now;
		const end = +new Date(time);
		const difference = end - start;
		// console.log('now', now, 'start', start, 'end', end, 'difference', difference);
		if (start > now && now < end) {
			return {
				d: Math.floor(difference / (1000 * 60 * 60 * 24)),
				h: Math.floor((difference / (1000 * 60 * 60)) % 24),
				m: Math.floor((difference / 1000 / 60) % 60),
				s: Math.floor((difference / 1000) % 60),
			};
		} else if (now > end) {
			return {};
		}
		let timeLeft = {};
		if (difference > 0) {
			timeLeft = {
				d: Math.floor(difference / (1000 * 60 * 60 * 24)),
				h: Math.floor((difference / (1000 * 60 * 60)) % 24),
				m: Math.floor((difference / 1000 / 60) % 60),
				s: Math.floor((difference / 1000) % 60),
			};
		}

		return timeLeft;
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		setTimeout(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);
	});

	const timerComponents = [];

	Object.keys(timeLeft).forEach((interval) => {
		if (!timeLeft[interval]) {
			return;
		}

		timerComponents.push(
			<span>
				{timeLeft[interval]}
				{interval}{' '}
			</span>
		);
	});
	const estSymbol = networkId === NetworkId['Mainnet-ovm'] ? '~' : '';
	const questionMark =
		networkId === NetworkId['Mainnet-ovm'] ? (
			<QuestionMark
				text={`Timestamps on Optimism will be 10-15 minutes behind the real time for the next few months`}
			/>
		) : null;
	return (
		<div>
			{timerComponents.length ? (
				<>
					<>{estSymbol}</>
					<>{timerComponents}</>
					<>{questionMark}</>
				</>
			) : (
				<span>Ended</span>
			)}
		</div>
	);
};

export default Countdown;
