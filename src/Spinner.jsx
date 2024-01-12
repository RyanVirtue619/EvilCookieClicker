import { useEffect, useState } from "react";
import { wait } from "./CCUtils";
import "./Slots.css";
export default function Spinner(props) {
	const [item, setItem] = useState("1");
	const [item2, setItem2] = useState("1");
	const [item3, setItem3] = useState("1");
	const [rolling, setRolling] = useState(false);
	const items = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	const roll = async () => {
		props.beginRoll();
		for (let i = 0; i < Math.random() * 25 + 10; i++) {
			setItem(items[Math.floor(Math.random() * items.length)]);
			setItem2(items[Math.floor(Math.random() * items.length)]);
			setItem3(items[Math.floor(Math.random() * items.length)]);
			await wait(Math.pow(i, 1.25) * 10 + 25);
		}
		setRolling(false);
	};

	const propRoll = props.onRoll;

	useEffect(() => {
		if (!rolling) {
			return propRoll(item, item2, item3);
		}
	}, [item, item2, item3, rolling, propRoll]);

	function itemVal() {
		return (
			(parseInt(item) * 100 + parseInt(item2) * 10 + parseInt(item)) / 999
		);
	}

	return (
		<>
			<div className="gambler">
				<div
					className="bgslot"
					style={{
						backgroundColor: `rgb(${0}, ${255 * itemVal()}, ${0})`,
					}}
				>
					<div className="slot">
						<div className={"container"}>{item}</div>
					</div>
					<div className="slot">
						<div className={"container"}>{item2}</div>
					</div>
					<div className="slot">
						<div className={"container"}>{item3}</div>
					</div>
				</div>
			</div>

			<div className="roller-holder">
				<div
					className={!rolling ? "roll rolling" : "roll"}
					onClick={async () => {
						if (!rolling) {
							setRolling(true);
							await roll();
						}
					}}
					disabled={rolling}
				>
					{rolling ? "Rolling..." : "ROLL"}
				</div>
			</div>
		</>
	);
}
