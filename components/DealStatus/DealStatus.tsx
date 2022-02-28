//@ts-nocheck
import { FC } from 'react';
import styled from 'styled-components';

import colors from 'styles/theme/colors';
import { statusToText } from 'constants/pool';
import { Circle } from 'components/Svg';

// POOL OPEN (when the current time is less than the purchase expiry - track this in the client and show a timer)
// SEEKING DEAL (when the current time is more than the purchase expiry but no deal has been presented yet)
// FUNDING DEAL (when a deal is in need of funding)
// DEAL OPEN (during the pro rata or redemption period phases)
// CLOSED (when either a deal has been submitted and is no longer redeemable or when a deal is never found and the duration passes)

// data needed to show proper status
// 1. Pool Open - before teh purchase expiry timestamp {x}
// 2. Seeking Deal - if the duration period is active and deal has not been presented yet { }
// 3. Funding Deal - whether a deal is in the holder funding period { }
// 4. Deal Open - when a deal is in pro rata or open period
// 5. Closed - if the duration period is passed and deal has not been presented or when deal is no longer redeemable

// how to know if deal has been presented? and then from there are we in the funding period or has that been completed and we are in a purchasing phase

export enum Status {
	PoolOpen = 'PoolOpen',
	SeekingDeal = 'SeekingDeal',
	FundingDeal = 'FundingDeal',
	ProRataRedemption = 'ProRataRedemption',
	OpenRedemption = 'OpenRedemption',
	DealOpen = 'DealOpen',
	Closed = 'Closed',
}

type DealStatusProps = {
	status: Status;
};

const getBackground = (status: Status) => {
	switch (status) {
		case Status.PoolOpen:
		case Status.DealOpen:
			return colors.blue2;
		case Status.SeekingDeal:
		case Status.FundingDeal:
			return colors.yellow;
		case Status.Closed:
			return colors.red;
	}
};

const DealStatus: FC<DealStatusProps> = ({ status }) => {
	return (
		<Container>
			<div>
				<Dot background={getBackground(status)} />
			</div>
			<StatusLabel>{statusToText(status)}</StatusLabel>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	width: 100%;
	justify-content: flex-start;
	padding-left: 10px;
	align-items: center;
`;

const StatusLabel = styled.span`
	margin: 4px 0 0 6px;
	text-transform: capitalize;
	text-align: left;
	padding-left: 5px;
`;

const Dot = styled(Circle)<{ background: string }>`
	width: 8px;
	height: 8px;
	fill: ${(props) => props.background};
`;
export default DealStatus;
