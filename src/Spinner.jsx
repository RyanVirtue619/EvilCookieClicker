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

	useEffect(() => {
		if (!rolling) {
			props.onRoll(item, item2, item3);
		}
	});

	return (
		<>
			<div>
				<div className="slot">
					<section>
						<div
							className={
								"container " + rolling ? "spinning " : ""
							}
						>
							{item}
						</div>
					</section>
				</div>
				<div className="slot">
					<section>
						<div
							className={
								"container " + rolling ? "spinning " : ""
							}
						>
							{item2}
						</div>
					</section>
				</div>
				<div className="slot">
					<section>
						<div
							className={
								"container " + rolling ? "spinning " : ""
							}
						>
							{item3}
						</div>
					</section>
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
