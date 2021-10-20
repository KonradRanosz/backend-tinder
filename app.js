const e = require("express");
const express = require("express");
const app = express();
var cors = require("cors");

app.use(cors());

const fs = require("fs");
const dataJSON = fs.readFileSync("db.json");
const movies = JSON.parse(dataJSON);

const ratingHelper = (positive, negative) =>
	((10 * positive) / (positive + negative)).toFixed(2);

app.get("/", (req, res) => {
	const apiInfoEndpoints = {
		getAll: "/recommendations",
		votePositive: "/recommendations/:id/accept",
		voteNegative: "/recommendations/:id/reject",
	};
	res.status(200).json(apiInfoEndpoints);
});

app.get("/recommendations", (req, res) => {
	res.status(200).json(movies);
});

app.put("/recommendations/:id/accept", (req, res) => {
	const newMoviesArr = movies.map((el) => {
		if (el.id == req.params.id) {
			el.votes.positive++;
			el.rating = ratingHelper(el.votes.positive, el.votes.negative);
		}
		return el;
	});

	fs.writeFileSync("db.json", JSON.stringify(newMoviesArr));
	res.status(200).send("success");
});

app.put("/recommendations/:id/reject", (req, res) => {
	const newMoviesArr = movies.map((el) => {
		if (el.id == req.params.id) {
			el.votes.negative++;
			el.rating = ratingHelper(el.votes.positive, el.votes.negative);
		}
		return el;
	});
	fs.writeFileSync("db.json", JSON.stringify(newMoviesArr));
	res.status(200).send("reject");
});

app.listen(3005, () => {
	console.log(`App listening at port http://localhost:3005`);
});
