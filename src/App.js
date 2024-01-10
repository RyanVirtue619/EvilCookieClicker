import { useEffect, useState } from "react";
import "./App.css";
import Cookie from "./Cookie";
import AutoCookie from "./AutoCookie";
import IRS from "./IRS";
import { round, BrowserState } from "./CCUtils";
import "./CookieStore.css";
import Spinner from "./Spinner";

const shopItems = {
	AutoCookie: [10, 1, 1.2],
	Grandma: [150, 5, 1.2],
	"Cookie Accelerator": [1337, 25, 1.2],
	"Mr Jaffe": [10000, 125, 1.1],
};

function App() {
	const [cookies, setCookies] = BrowserState(0, "cookies");
	const [data, setData] = BrowserState(
		{ AutoCookie: 0, Grandma: 0, "Cookie Accelerator": 0, "Mr Jaffe": 0 },
		"data"
	);
	const [lastWin, setLastWin] = useState(0);
	const [taxTimer, setTaxTimer] = useState(0);
	const [taxPercentage, setTaxPercentage] = useState(0);
	const [multiBuy, setMultiBuy] = useState(1);
	const [bet, setBet] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCookies(cookies + cps() / 100);
			if (taxTimer > 0) {
				setTaxTimer(taxTimer - 0.01);
			} else {
				setTaxTimer(Math.random() * 30 + 30);
				setCookies(cookies * (1 - taxPercentage));
				setTaxPercentage(Math.random());
			}
		}, 10);
		return () => clearInterval(interval);
	});
	// useEffect(() => {
	// 	if (cookies > bet) {
	// 		setBet(parseInt(cookies));
	// 	}
	// }, [cookies, bet]);

	function cps() {
		let total = 0;
		Object.keys(shopItems).forEach((el) => {
			total += data[el] * shopItems[el][1];
		});
		return total;
	}

	function getPrice(el) {
		return (
			(shopItems[el][0] *
				Math.pow(shopItems[el][2], data[el]) *
				(1 - Math.pow(shopItems[el][2], multiBuy))) /
			(1 - shopItems[el][2])
		);
	}

	const buyItem = (name) => {
		if (cookies >= getPrice(name)) {
			setCookies(cookies - getPrice(name));
			setData({
				...data,
				[name]: data[name] + multiBuy,
			});
		}
	};

	return (
		<div className="App">
			<IRS taxPerc={taxPercentage} time={taxTimer} />

			<div>{"CPS: " + cps()}</div>
			<Cookie
				onClick={() => {
					setCookies(cookies + 1);
				}}
				cookies={cookies}
			/>
			<div>{"Cookies: " + round(cookies, 0)}</div>
			{/* <div onClick={() => console.log(data)}>Log Data</div> */}
			<div className="menu top">
				<div className="sign-holder">
					<div className="shop-title">Cookie Store</div>
				</div>
				<div className="multi-buy">
					<input
						type="number"
						value={multiBuy}
						className="multi-buy-num"
						placeholder={"Enter multi buy value"}
						onInput={(e) => {
							setMultiBuy(parseInt(e.target.value || 1));
						}}
					/>
				</div>
				{Object.keys(shopItems).map((el) => {
					return (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								padding: "0px 10px",
							}}
						>
							<AutoCookie
								key={el}
								onClick={() => {
									buyItem(el);
								}}
								text={el + ` (${round(getPrice(el), 2)})`}
							/>
							<div className="itemcount-holder">
								<div className="itemcount">{data[el]}</div>
							</div>
						</div>
					);
				})}
			</div>
			<div className="menu">
				<div className="sign-holder">
					<div className="shop-title">Casino</div>
				</div>
				<div className="bet">
					<input
						type="number"
						max={cookies}
						className="multi-buy-num"
						placeholder={"Enter bet value"}
						onInput={(e) => {
							let inp = parseInt(e.target.value);
							if (inp > cookies) {
								setBet(cookies);
							} else {
								setBet(inp > 0 ? inp : 1);
							}
						}}
					/>
				</div>
				<div className="bet">
					<div className="last-win-ticker">
						Last Win: {round(lastWin, 5)}
					</div>
				</div>
				<Spinner
					onRoll={(i, j, k) => {
						console.log("Rolled", i, j, k);
						setLastWin(
							Math.max(
								0,
								bet *
									(Math.pow(
										1.003,
										parseInt(i) * 100 +
											parseInt(j) * 10 +
											parseInt(k)
									) -
										9.93)
							)
						);
					}}
					beginRoll={() => {
						setCookies(cookies - bet);
					}}
				/>
			</div>
			<button
				onClick={() => {
					console.log("Data", data);
					console.log("Cookies", cookies);
					console.log("Bet", bet);
				}}
			>
				log
			</button>
			<button
				onClick={() => {
					setCookies(0);
					setData({
						AutoCookie: 0,
						Grandma: 0,
						"Cookie Accelerator": 0,
						"Mr Jaffe": 0,
					});
					localStorage.clear();
				}}
			>
				RESET
			</button>
		</div>
	);
}

export default App;
