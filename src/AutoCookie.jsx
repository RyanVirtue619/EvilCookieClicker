import "./AutoCookie.css";

export default function AutoCookie(props) {
	return (
		<>
			<button className="autocookie" onClick={props.onClick}>
				{props.text}
			</button>
		</>
	);
}
