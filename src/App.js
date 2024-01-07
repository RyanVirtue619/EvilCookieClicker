import { useEffect, useState } from "react";
import "./App.css";
import Cookie from "./Cookie";
import AutoCookie from "./AutoCookie";
import IRS from "./IRS";
import { round, BrowserState } from "./CCUtils";
import "./CookieStore.css";

const shopItems = {
	AutoCookie: [10, 1, 1.2],
	Grandma: [150, 5, 1.2],
	"Cookie Accelerator": [1337, 25, 1.2],
};

function App() {
	// localStorage.clear();
	const [cookies, setCookies] = BrowserState(0, "cookies");
	const [data, setData] = BrowserState(
		{ AutoCookie: 0, Grandma: 0, "Cookie Accelerator": 0 },
		"data"
	);
	const [taxTimer, setTaxTimer] = useState(60);
	const [taxPercentage, setTaxPercentage] = useState(0.5);
	const [multiBuy, setMultiBuy] = useState(1);

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
			<Cookie
				onClick={() => {
					setCookies(cookies + 1);
				}}
				cookies={cookies}
			/>
			<div>{"CPS: " + cps()}</div>
			<div>{"Cookies: " + round(cookies, 0)}</div>
			{/* <div onClick={() => console.log(data)}>Log Data</div> */}
			<div className="store">
				<div className="store-title">Cookie Store</div>
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
							<div>{data[el]}</div>
						</div>
					);
				})}
				<div>
					<input
						type="number"
						placeholder={"Enter multi buy value"}
						onInput={(e) => {
							setMultiBuy(parseInt(e.target.value || 1));
						}}
					/>
				</div>
			</div>

			<button
				onClick={() => {
					console.log(data);
				}}
			>
				log
			</button>
			<button
				onClick={() => {
					setCookies(0);
					localStorage.clear();
				}}
			>
				RESET
			</button>
		</div>
	);
}

export default App;
