// let values = [3, 5, 7, 10, 12, 15, 17, 20, 25, 30, 35, 40, 45, 50];

function rating_to_points(rating) {
	let p = Math.min(60 / (1 + Math.exp(-(rating-2300)/600)), 50);
	// Learn more: https://www.desmos.com/calculator/zgvf4p7n8v
	// let ans = 50;
	// for (let x of values) {
	// 	if (p < x) {
	// 		ans = x;
	// 		break;
	// 	}
	// }
	// return ans;
	return p;
}

function points_to_rating(points) {
	let rating = -Math.log(60/Math.abs(points) - 1) * 600 + 2300;
	// Inverse of the above function
	return Math.round(rating);
}

function rating_to_number(rating) {
	let ans = 0;
	let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
	for (const [uid, user] of Object.entries(users)) {
		if (user.rating >= rating) ans++;
	}
	return ans;
}

function update_rating(old_rating, rating_deviation, points) {
	let perf_rating = points_to_rating(points);
	let delta = perf_rating - old_rating;
	if (delta < -200 && points > 0) {
		// solved a problem that was too easy
		delta = 50;
	}
	if (points < 0 && delta > 200) {
		// could not solve a problem that was too hard
		delta = -50;
	} else if (points < 0) {
		// could not solve a problem that was not too hard
		delta = -Math.round(delta / 2);
	}
	console.log(old_rating, perf_rating, rating_deviation, delta);
	let new_rating = Math.round((old_rating + delta * (rating_deviation + 100) / 500));
	let new_rating_deviation = Math.min(Math.round(Math.sqrt((rating_deviation + 1) * (Math.abs(delta) + 1) - 1)), 500);
	return [Math.max(new_rating, 0), new_rating_deviation];
}

function rating_to_title(rating) {
	if (rating < 1000) return "Iron";
	if (rating < 1200) return "Bronze";
	if (rating < 1400) return "Silver";
	if (rating < 1600) return "Gold";
	if (rating < 1800) return "Platinum";
	if (rating < 2000) return "Diamond";
	if (rating < 2500) return "Master";
	if (rating < 3000) return "Grandmaster";
	return "Immortal";
}

function point_ranges(rating_deviation) {
	return Math.log(rating_deviation) * 1.5;
}

module.exports = {
	rating_to_points,
	rating_to_title,
	rating_to_number,
	update_rating,
	point_ranges,
	titles: ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster", "Immortal"],
};
