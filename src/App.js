import { useEffect, useState, useCallback, useRef, useMemo } from "react";
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
	const [taxedCookies, setTaxedCookies] = BrowserState(0, "taxed");
	const [lastWin, setLastWin] = useState(0);
	const [taxTimer, setTaxTimer] = useState(0);
	const [taxPercentage, setTaxPercentage] = useState(0);
	const [gaveCookies, setGaveCookies] = useState(0);
	const [multiBuy, setMultiBuy] = useState(1);

	const betRef = useRef();
	useEffect(() => {
		const interval = setInterval(() => {
			setCookies(cookies + cps / 100);
			if (taxTimer > 0) {
				setTaxTimer(taxTimer - 0.01);
			} else {
				setTaxTimer(Math.random() * 30 + 30);
				setTaxedCookies(taxedCookies + cookies * taxPercentage);
				setCookies(cookies * (1 - taxPercentage));
				setTaxPercentage(Math.random());
			}
			if (betRef.current.value > cookies)
				betRef.current.value = round(cookies, 0);
		}, 10);
		return () => clearInterval(interval);
	});

	useEffect(() => {
		if (gaveCookies === 0) {
			setCookies(cookies + lastWin);
			setGaveCookies(1);
		}
	}, [cookies, lastWin, gaveCookies, setCookies]);

	const cps = useMemo(() => {
		let total = 0;
		Object.keys(shopItems).forEach((el) => {
			total += data[el] * shopItems[el][1];
		});
		return total;
	}, [data]);

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

	const roll = useCallback((i, j, k) => {
		console.log("Rolling");
		setLastWin(
			Math.max(
				0,
				betRef.current.value *
					Math.pow(
						1.00773068209,
						parseInt(i) * 100 + parseInt(j) * 10 + parseInt(k) - 700
					)
			)
		);
		setGaveCookies(0);
	}, []);

	const logger = () => {
		console.table(localStorage);
	};

	const castBet = () => {
		setCookies(Math.max(0, cookies - betRef.current.value));
	};

	return (
		<div className="App">
			<IRS taxPerc={taxPercentage} time={taxTimer} total={taxedCookies} />

			<div>{"CPS: " + cps}</div>
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
						ref={betRef}
						type="number"
						className="multi-buy-num"
						placeholder={"Enter bet value"}
						onChange={(e) => {
							if (e.target.value < 0) {
								e.target.value = 0;
							} else if (e.target.value > cookies) {
								e.target.value = round(cookies, 0);
							}
						}}
					/>
				</div>
				<div className="bet">
					<div className="last-win-ticker">
						Last Win: {round(lastWin, 0)}
					</div>
				</div>
				<Spinner onRoll={roll} beginRoll={castBet} />
			</div>
			<button onClick={logger}>LOG EVERYTHING</button>
			<button
				onClick={() => {
					setCookies(0);
					setData({
						AutoCookie: 0,
						Grandma: 0,
						"Cookie Accelerator": 0,
						"Mr Jaffe": 0,
					});
					setTaxedCookies(0);
					localStorage.clear();
				}}
			>
				RESET
			</button>
		</div>
	);
}

export default App;
