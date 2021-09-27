import { FC } from 'react';
import styled, { css } from 'styled-components';

import colors from 'styles/theme/colors';

export enum Status {
	OPEN = 'open',
	DEAL = 'deal',
	EXPIRED = 'expired',
	REJECTED = 'rejected',
}

type DealStatusProps = {
	status: Status;
};

const getBackground = (status: Status) => {
	switch (status) {
		case Status.OPEN:
			return colors.statusBlue;
		case Status.DEAL:
			return colors.statusGreen;
		case Status.EXPIRED:
			return colors.statusYellow;
		case Status.REJECTED:
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
