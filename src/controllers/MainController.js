const ApiService = require('../services/ApiService');
const CooldownService = require('../services/CooldownService');

let self;

class MainController {
	constructor() {
		this.apiSerice = new ApiService();
		this.mainView = null;
		this.cooldownService = new CooldownService();
		this.interval = [];
		self = this;
	}

	setView(view) {
		self.mainView = view;
	}

	/**
	 * Handles the form submit event
	 * @param {*} event of the form submit
	 */
	async submitForm(event) {
		event.preventDefault();
		self.clear();

		const name = event.target.name.value;
		if (!name || name.length === 0) {
			self.mainView.renderError('Name is required');
			return;
		}

		try {
			const enemies = await self.apiSerice.getEnemies(name);
			self.mainView.renderEnemies(enemies);
		} catch (error) {
			console.error(error);
			self.mainView.renderError('Something went wrong. Please try again!');
		}
	}

	/**
	 * Clears all intervals and the enemies from the view
	 */
	clear() {
		self.mainView.renderError('');
		self.mainView.clearEnemies();
		self.cooldownService.clearIntervals();
	}

	/**
	 * Handles the event when a summoner spell is clicked
	 * @param {*} button of the summoner spell
	 * @param {*} span of the summoner spell
	 * @param {*} cd of the summoner spell
	 */
	handleSummonerClick(button, span, cd) {
		self.cooldownService.setSummonerOnCooldown(button, span, cd);
	}
}

module.exports = MainController;
