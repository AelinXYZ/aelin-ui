import { FC } from 'react';
import Countdown, { CountdownRenderProps } from 'react-countdown';

interface TimeLeftProps {
	timeLeft: number;
}

const TimeLeft: FC<TimeLeftProps> = ({ timeLeft }) => (
	<Countdown
		date={Date.now() + timeLeft}
		renderer={({ days, hours, minutes, completed }: CountdownRenderProps) => {
			if (completed) {
				// Render a completed state
				return <span>--</span>;
			} else {
				// Render a countdown
				return (
					<span>
						{days} days, {hours} hours {minutes} minutes
					</span>
				);
			}
		}}
	/>
);

export default TimeLeft;
TimeLeft.displayName = 'TimeLeft';
