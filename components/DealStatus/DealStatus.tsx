import { FC } from 'react';
import styled from 'styled-components';

import colors from 'styles/theme/colors';

// POOL OPEN (when the current time is less than the purchase expiry - track this in the client and show a timer)
// SEEKING DEAL (when the current time is more than the purchase expiry but no deal has been presented yet)
// FUNDING DEAL (when a deal is in need of funding)
// DEAL OPEN (during the pro rata or redemption period phases)
// CLOSED (when either a deal has been submitted and is no longer redeemable or when a deal is never found and the duration passes)

export enum Status {
	PoolOpen = 'Pool open',
	SeekingDeal = 'Seeking deal',
	FundingDeal = 'Funding deal',
	DealOpen = 'Deal open',
	Closed = 'Closed',
}

type DealStatusProps = {
	status: Status;
};

const getBackground = (status: Status) => {
	switch (status) {
		case Status.PoolOpen:
		case Status.DealOpen:
			return colors.statusBlue;
		case Status.SeekingDeal:
		case Status.FundingDeal:
			return colors.statusYellow;
		case Status.Closed:
			return colors.statusRed;
	}
};

const DealStatus: FC<DealStatusProps> = ({ status }) => {
	return (
		<Container>
			<Dot background={getBackground(status)} />
			<StatusLabel>{status}</StatusLabel>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
`;

const StatusLabel = styled.span`
	margin: 4px 0 0 6px;
	text-transform: capitalize;
`;

const Dot = styled.div<{ background: string }>`
	width: 7px;
	height: 7px;
	border-radius: 50%;
	background: ${(props) => props.background};
	border: 1px solid ${(props) => props.theme.colors.headerGrey};
`;

export default DealStatus;
