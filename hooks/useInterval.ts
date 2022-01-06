import { useEffect, useRef } from 'react';

const useInterval = (callback: Function, delay: number) => {
	const savedCallback = useRef();

	// Remember the latest callback.
	useEffect(() => {
		// @ts-ignore
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		function tick() {
			// @ts-ignore
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
};

export default useInterval;
