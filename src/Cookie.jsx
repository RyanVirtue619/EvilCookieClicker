import React from "react";
import cookie from "./cookie.jpeg";
import "./Cookie.css";

export default function Cookie(props) {
	return (
		<>
			<img
				alt="cookie"
				src={cookie}
				onClick={props.onClick}
				className="cookie"
			></img>
		</>
	);
}
