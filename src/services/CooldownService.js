let self = null;

class CooldownService {
	constructor() {
		if (!self) {
			self = this;
			this.interval = [];
		}
		return self;
	}

	/**
	 * Sets a summoner spell on cooldown
	 *
	 * @param {*} button of the summoner spell pressed
	 * @param {*} span of the summoner spell pressed
	 * @param {*} cd of the summoner spell pressed
	 * @returns
	 */
	setSummonerOnCooldown(button, span, cd) {
		if (button.disabled) return;

		button.disabled = true;
		span.innerHTML = Math.round(cd);
		let interval = setInterval(() => {
			if (span.innerHTML === '0') {
				span.innerHTML = 'UP';
				button.disabled = false;
				clearInterval(interval);
			} else {
				span.innerHTML = Math.round(parseFloat(span.innerHTML) - 1);
			}
		}, 1000);

		self.interval.push(interval);
	}

	/**
	 * Clears all ongoing intervals
	 */
	clearIntervals() {
		self.interval.forEach((interval) => clearInterval(interval));
	}
}

module.exports = CooldownService;
