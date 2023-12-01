let self;

class MainView {
	constructor(controller) {
		this.controller = controller;
		this.controller.setView(this);
		self = this;
	}

	/**
	 * Initializes the main view
	 */
	init() {
		const app = document.querySelector('#form');

		const form = document.createElement('form');
		form.classList.add('form');

		const wrapper = document.createElement('div');
		wrapper.classList.add('form-wrapper');

		const input = document.createElement('input');
		input.type = 'text';
		input.name = 'name';
		input.placeholder = 'Summoner name';

		const button = document.createElement('button');
		button.type = 'submit';
		button.innerHTML = 'Start game';

		const errorMessage = document.createElement('p');
		errorMessage.id = 'error-message';
		errorMessage.classList.add('error-msg');

		wrapper.appendChild(input);
		wrapper.appendChild(button);

		form.appendChild(wrapper);
		form.appendChild(errorMessage);

		form.onsubmit = self.controller.submitForm;

		app.appendChild(form);
	}

	/**
	 * Renders an error message
	 * @param {*} message to be rendered
	 */
	renderError(message) {
		const errorMessage = document.querySelector('#error-message');
		errorMessage.innerHTML = message;
	}

	/**
	 * Renders all enemies
	 * @param {*} enemies to be rendered
	 */
	renderEnemies(enemies) {
		const opponents = document.querySelector('#opponents');

		const ul = document.createElement('ul');
		ul.classList.add('opponents');

		enemies.forEach((enemy, index) => {
			ul.appendChild(self.createEnemyItem(enemy, index));
		});

		opponents.appendChild(ul);
	}

	/**
	 * Creates an enemy gui tiem
	 * @param {*} enemy to be rendered
	 * @param {*} index of the enemy in the list
	 * @returns an li element with the enemy
	 */
	createEnemyItem(enemy, index) {
		const li = document.createElement('li');
		li.classList.add('opponent');

		if (index % 2 === 0) {
			li.classList.add('variant');
		}

		// Lane icon
		let imgSrc;
		switch (index) {
			case 0:
				imgSrc = './icons/lanes/TOP.png';
				break;
			case 1:
				imgSrc = './icons/lanes/JUNGLE.png';
				break;
			case 2:
				imgSrc = './icons/lanes/MIDDLE.png';
				break;
			case 3:
				imgSrc = './icons/lanes/BOTTOM.png';
				break;
			case 4:
				imgSrc = './icons/lanes/UTILITY.png';
				break;
			default:
				imgSrc = './icons/lanes/UNKNOWN.png';
				break;
		}

		const img = document.createElement('img');
		img.classList.add('lane-icon');
		img.src = imgSrc;
		img.alt = `${enemy.lane} icon`;

		// Info wrapper
		const info = document.createElement('div');
		info.classList.add('opponent-info');

		// const champion = document.createElement('p');
		// champion.classList.add('opponent-champion');
		// champion.innerHTML = enemy.champion;

		const name = document.createElement('p');
		name.classList.add('opponent-name');
		name.innerHTML = enemy.name;

		// info.appendChild(champion);
		info.appendChild(name);

		// Summoners wrapper
		const summoners = document.createElement('div');
		summoners.classList.add('opponent-sums');

		// Summoner 1
		const button1 = document.createElement('button');
		button1.id = `btn-${index}1`;
		button1.type = 'button';
		button1.dataset.cd = enemy.getSummoner1Cd();

		const spell1 = document.createElement('img');
		spell1.classList.add('spell-icon');
		spell1.src = `./icons/spells/${enemy.getSummoner1Name()}.webp`;
		spell1.alt = `${enemy.getSummoner1Name()} icon`;

		const span1 = document.createElement('span');
		span1.id = `cd-${index}1`;
		span1.classList.add('countdown');
		span1.innerHTML = 'UP';

		button1.onclick = () =>
			self.controller.handleSummonerClick(
				button1,
				span1,
				enemy.getSummoner1Cd()
			);

		button1.appendChild(spell1);
		button1.appendChild(span1);

		// Summoner 2
		const button2 = document.createElement('button');
		button2.id = `btn-${index}2`;
		button2.type = 'button';
		button2.dataset.cd = enemy.getSummoner2Cd();

		const spell2 = document.createElement('img');
		spell2.classList.add('spell-icon');
		spell2.src = `./icons/spells/${enemy.getSummoner2Name()}.webp`;
		spell2.alt = `${enemy.getSummoner2Name()} icon`;

		const span2 = document.createElement('span');
		span2.id = `cd-${index}2`;
		span2.classList.add('countdown');
		span2.innerHTML = 'UP';

		button2.onclick = () =>
			self.controller.handleSummonerClick(
				button2,
				span2,
				enemy.getSummoner2Cd()
			);

		button2.appendChild(spell2);
		button2.appendChild(span2);

		summoners.appendChild(button1);
		summoners.appendChild(button2);

		li.appendChild(img);
		li.appendChild(info);
		li.appendChild(summoners);

		return li;
	}

	/**
	 * Clears all enemies from the view
	 */
	clearEnemies() {
		const opponents = document.querySelector('#opponents');
		opponents.innerHTML = '';
	}
}

module.exports = MainView;
