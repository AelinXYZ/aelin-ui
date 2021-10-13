import React from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';
import { FlexDivCentered, FlexDivCol, FlexDivRowCentered } from '../common';

import Spinner from 'assets/svg/app/spinner.svg';
import Success from 'assets/svg/app/success.svg';
import Failure from 'assets/svg/app/failure.svg';

type NotificationProps = {
	closeToast?: Function;
	failureReason?: string;
	link?: string;
};

const NotificationPending = () => {
	return (
		<NotificationContainer>
			<IconContainer>
				<Image width={25} src={Spinner} alt="pending tx" />
			</IconContainer>
			<TransactionInfo>Tx Sent</TransactionInfo>
		</NotificationContainer>
	);
};

const NotificationSuccess = ({ link }: NotificationProps) => {
	return (
		<NotificationContainer data-testid="tx-notification-transaction-confirmed" data-href={link}>
			<IconContainer>
				<Image width={35} src={Success} alt="successful tx" />
			</IconContainer>
			<TransactionInfo>Tx Confirmed</TransactionInfo>
		</NotificationContainer>
	);
};

const NotificationError = ({ failureReason }: NotificationProps) => {
	return (
		<NotificationContainer>
			<IconContainer>
				<Image width={35} src={Failure} alt="failed tx" />
			</IconContainer>
			<TransactionInfo>
				<TransactionInfoBody>Tx Failed</TransactionInfoBody>
				<TransactionInfoBody isFailureMessage={true}>{failureReason}</TransactionInfoBody>
			</TransactionInfo>
		</NotificationContainer>
	);
};

const NotificationContainer = styled(FlexDivCentered)``;
const IconContainer = styled(FlexDivRowCentered)`
	width: 35px;
`;

const TransactionInfo = styled(FlexDivCol)``;
const TransactionInfoBody = styled.div<{ isFailureMessage?: boolean }>`
	${(props) =>
		props.isFailureMessage &&
		css`
			color: ${(props) => props.theme.colors.gray};
		`}
`;

export { NotificationPending, NotificationSuccess, NotificationError };
