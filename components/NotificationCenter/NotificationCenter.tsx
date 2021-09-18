import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import NotificationIcon from 'assets/svg/notification-icon.svg';

const NotificationCenter: FC = () => {
	return (
		<Container>
			<Image src={NotificationIcon} alt="notification icon" />
		</Container>
	);
};

const Container = styled.div`
	margin-right: 10px;
	height: 15px;
	cursor: pointer;
	box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.25);
`;

export default NotificationCenter;
