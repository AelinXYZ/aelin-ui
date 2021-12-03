import React from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';
import { FlexDivCentered, FlexDivCol, FlexDivRowCentered } from '../common';

import Spinner from 'assets/svg/spinner.svg';
import Success from 'assets/svg/success.svg';
import Failure from 'assets/svg/failure.svg';

type NotificationProps = {
	closeToast?: Function;
	failureReason?: string;
	link?: string;
};

const NotificationPending = () => {
	return (
		<NotificationContainer>
			<IconContainer>
				<Image width={25} height={25} src={Spinner} alt="pending tx" />
			</IconContainer>
			<TransactionInfo style={{ marginTop: '5px' }}>
				<TransactionInfoHeading>Transaction Sent</TransactionInfoHeading>
				<TransactionInfoBody>Click to verify on Etherscan</TransactionInfoBody>
			</TransactionInfo>
		</NotificationContainer>
	);
};

const NotificationSuccess = ({ link }: NotificationProps) => {
	return (
		<NotificationContainer data-testid="tx-notification-transaction-confirmed" data-href={link}>
			<IconContainer>
				<Image width={35} height={35} src={Success} alt="successful tx" />
			</IconContainer>
			<TransactionInfo>
				<TransactionInfoHeading>Transaction Confirmed!</TransactionInfoHeading>
				<TransactionInfoBody>Click to verify on Etherscan</TransactionInfoBody>
			</TransactionInfo>
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
				<TransactionInfoHeading>Transaction Failed</TransactionInfoHeading>
				<TransactionInfoBody isFailureMessage={true}>{failureReason}</TransactionInfoBody>
			</TransactionInfo>
		</NotificationContainer>
	);
};

const NotificationContainer = styled(FlexDivCentered)``;
const IconContainer = styled(FlexDivRowCentered)`
	width: 35px;
`;

const TransactionInfo = styled(FlexDivCol)`
	margin-left: 10px;
`;
const TransactionInfoHeading = styled.h3`
	margin: 0;
	font-size: 14px;
	color: ${(props) => props.theme.colors.headerGreen};
`;

const TransactionInfoBody = styled.div<{ isFailureMessage?: boolean }>`
	font-size: 12px;
	${(props) =>
		props.isFailureMessage &&
		css`
			color: ${(props) => props.theme.colors.black};
		`}
`;

export { NotificationPending, NotificationSuccess, NotificationError };
