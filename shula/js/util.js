'use strict'
function getRandomArray(length) {
	var nums = [];

	for (var i = 0; i < length; i++) {
		nums[i] = i + 1;
	}

	nums = shuffleArray(nums);

	return nums;
}

function shuffleArray(items) {
	var randIdx, keep, i;
	for (i = items.length - 1; i > 0; i--) {
		randIdx = getRandomInt(0, items.length - 1);

		keep = items[i];
		items[i] = items[randIdx];
		items[randIdx] = keep;
	}
	return items;
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
