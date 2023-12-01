const ApiService = require('../services/ApiService');

let self;

class MainController {
	constructor() {
		this.apiSerice = new ApiService();
		this.mainView = null;
		this.interval = [];
		self = this;
	}

	setView(view) {
		self.mainView = view;
	}

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
			self.mainView.renderError('TODO: Add custome error messages');
		}
	}

	/**
	 * Clears all intervals and the enemies from the view
	 */
	clear() {
		self.mainView.renderError('');
		self.mainView.clearEnemies();
		self.interval.forEach((interval) => clearInterval(interval));
	}

	handleSummonerClick(button, span, cd) {
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
}

module.exports = MainController;
