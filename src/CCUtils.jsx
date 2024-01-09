import { useEffect, useState } from "react";

// format is [initial cost, cps, price scaling]
export const round = (num, places) => {
	return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
};

// stores data on localStorage and manages the state for it.
export function BrowserState(defaultVal, key) {
	const [n, s] = useState(() => {
		const v = window.localStorage.getItem(key);
		return v !== null ? JSON.parse(v) : defaultVal;
	});
	useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(n));
	}, [key, n]);
	return [n, s];
}

export function wait(delay) {
	return new Promise((res) => setTimeout(res, delay));
}
