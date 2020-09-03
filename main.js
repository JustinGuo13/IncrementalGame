var timer = 256;
var tickRate = 16;
var visualRate = 256;
var resources = { experience: 0, monster_level: 1 };
var costs = { monster_level: 15, feeder: 200, feeder_level: 15 };
var growthRate = { monster_level: 1.25, feeder: 1.25, feeder_level: 1.75 };

var increments = [{ input: ['feeder', 'feeder_level'], output: 'experience' }];

var unlocks = {
	monster_level: { experience: 10 },
	feeder: { experience: 100 },
	feeder_level: { feeder: 1 },
};

function gainExp(num) {
	resources['experience'] += num * resources['monster_level'];
	updateText();
}

function levelUpFeeder(num) {
	if (resources['experience'] >= costs['feeder_level'] * num) {
		resources['feeder_level'] += num;
		resources['experience'] -= num * costs['feeder_level'];

		costs['feeder_level'] *= growthRate['feeder_level'];

		updateText();
	}
}

function levelUpMonster(num) {
	if (resources['experience'] >= costs['monster_level'] * num) {
		resources['monster_level'] += num;
		resources['experience'] -= num * costs['monster_level'];

		costs['monster_level'] *= growthRate['monster_level'];

		updateText();
	}
}

function hireFeeder(num) {
	if (resources['experience'] >= costs['feeder'] * num) {
		if (!resources['feeder']) {
			resources['feeder'] = 0;
		}
		if (!resources['feeder_level']) {
			resources['feeder_level'] = 1;
		}
		resources['feeder'] += num;
		resources['experience'] -= num * costs['feeder'];

		costs['feeder'] *= growthRate['feeder'];

		updateText();
	}
}

function updateText() {
	for (var key in unlocks) {
		var unlocked = true;
		for (var criterion in unlocks[key]) {
			unlocked =
				unlocked && resources[criterion] >= unlocks[key][criterion];
		}
		if (unlocked) {
			for (var element of document.getElementsByClassName(
				'show_' + key
			)) {
				element.style.display = 'block';
			}
		}
	}

	for (var key in resources) {
		for (var element of document.getElementsByClassName(key)) {
			element.innerHTML = resources[key].toFixed(2);
		}
	}
	for (var key in costs) {
		for (var element of document.getElementsByClassName(key + '_cost')) {
			element.innerHTML = costs[key].toFixed(2);
		}
	}
}

window.setInterval(function () {
	timer += tickRate;

	for (var increment of increments) {
		total = 1;
		for (var input of increment['input']) {
			total *= resources[input];
		}
		if (total) {
			console.log(total);
			resources[increment['output']] += total / tickRate;
		}
	}

	if (timer > visualRate) {
		timer -= visualRate;
		updateText();
	}
}, tickRate);
