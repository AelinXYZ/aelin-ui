import { ONE_DAY_IN_SECS, ONE_HOUR_IN_SECS, ONE_MINUTE_IN_SECS } from 'constants/time';

export const convertToSeconds = ({
	days,
	hours,
	minutes,
}: {
	days: number;
	hours: number;
	minutes: number;
}) => days * ONE_DAY_IN_SECS + hours * ONE_HOUR_IN_SECS + minutes * ONE_MINUTE_IN_SECS;
