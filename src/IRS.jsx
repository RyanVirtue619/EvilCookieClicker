import React from "react";
import { round } from "./CCUtils";
import "./IRS.css";
import IRSIMG from "./irs-logo.png";

export default function IRS(props) {
	return (
		<div className={"taxation-center"}>
			<img className={"irs-logo"} src={IRSIMG} alt={"IRS LOGO"} />
			<div>Current Tax Percentage: {round(props.taxPerc * 100, 2)}%</div>
			<div className="irs-text">
				Payment due in: {round(props.time, 1)} seconds
			</div>
			<div>Total stolen cookies: {round(props.total, 0)}</div>
		</div>
	);
}
