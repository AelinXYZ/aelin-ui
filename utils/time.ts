import { add, format, formatDistanceStrict, isAfter } from 'date-fns';
import { ONE_DAY_IN_SECS, ONE_HOUR_IN_SECS, ONE_MINUTE_IN_SECS } from 'constants/time';
import { Status } from 'components/DealStatus';
export const convertToSeconds = ({
	days,
	hours,
	minutes,
}: {
	days: number;
	hours: number;
	minutes: number;
}) => days * ONE_DAY_IN_SECS + hours * ONE_HOUR_IN_SECS + minutes * ONE_MINUTE_IN_SECS;

export const getDuration = (startDate: Date, days: number, hours: number, minutes: number) => {
	const startTimestamp = startDate.getTime();
	const endTimestamp = add(startDate, {
		days,
		hours,
		minutes,
	}).getTime();
	return (endTimestamp - startTimestamp) / 1000;
};

export const formatDuration = (days: number, hours: number, minutes: number) => {
	return `${days || 0}d ${hours || 0}h ${minutes || 0}m`;
};

export const formatShortDateWithTime = (date: Date | number) => format(date, 'MMM d, yyyy H:mma');

export const showDateOrMessageIfClosed = (
	date: Date | number,
	message: string,
	dateFormat: string
) => {
	if (isAfter(new Date(date), new Date())) {
		return format(date, dateFormat || 'MMM d, yyyy H:mma');
	}
	return message;
};

export const calculateStatus = ({
	poolStatus,
	purchaseExpiry,
}: {
	poolStatus: Status;
	purchaseExpiry: number;
}): Status => {
	const now = Date.now();
	if (poolStatus === Status.PoolOpen && now > purchaseExpiry) {
		return Status.SeekingDeal;
	}
	return poolStatus;
};

export const formatTimeDifference = (timeDiff: number) => {
	const now = Date.now();
	return formatDistanceStrict(now, now + timeDiff);
};
