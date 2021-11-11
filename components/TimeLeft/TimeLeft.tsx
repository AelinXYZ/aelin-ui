import { FC } from 'react';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import styled from 'styled-components';
import { FlexDivCol } from 'components/common';

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
					<FlexDivCol>
						<SpacedDiv>{days} days</SpacedDiv>
						<SpacedDiv>{hours} hours</SpacedDiv>
						<SpacedDiv>{minutes} minutes</SpacedDiv>
					</FlexDivCol>
				);
			}
		}}
	/>
);

const SpacedDiv = styled.div`
	margin-bottom: 2px;
`;

export default TimeLeft;
TimeLeft.displayName = 'TimeLeft';
