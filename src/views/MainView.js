const MainController = require('../controllers/MainController');

let self;

class MainView {
	constructor(controller) {
		this.controller = controller;
		this.controller.setView(this);
		self = this;
	}

	init() {
		const app = document.querySelector('#app');

		const form = document.createElement('form');
		form.classList.add('form');

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

		form.appendChild(input);
		form.appendChild(button);
		form.appendChild(errorMessage);

		form.onsubmit = self.controller.submitForm;

		app.appendChild(form);
	}

	renderError(message) {
		const errorMessage = document.querySelector('#error-message');
		errorMessage.innerHTML = message;
	}

	renderEnemies(enemies) {
		const opponents = document.querySelector('#opponents');

		const ul = document.createElement('ul');
		ul.classList.add('opponents');

		enemies.forEach((enemy, index) => {
			ul.appendChild(self.createEnemyItem(enemy, index));
		});

		opponents.appendChild(ul);
	}

	createEnemyItem(enemy, index) {
		const li = document.createElement('li');
		li.classList.add('opponent');

		if (index % 2 === 0) {
			li.classList.add('variant');
		}

		const img = document.createElement('img');
		img.classList.add('lane-icon');
		img.src = `./icons/${enemy.lane}.png`;
		img.alt = `${enemy.lane} icon`;

		const div = document.createElement('div');
		div.classList.add('opponent-body');

		const p = document.createElement('p');
		p.classList.add('opponent-name');
		p.innerHTML = enemy.name;

		const div2 = document.createElement('div');
		div2.classList.add('opponent-sums');

		const button1 = document.createElement('button');
		button1.type = 'button';
		button1.innerHTML = `${enemy.getSummoner1Name()}: `;

		const span1 = document.createElement('span');
		span1.innerHTML = 'UP';

		button1.onclick = () =>
			self.controller.handleSummonerClick(
				button1,
				span1,
				enemy.getSummoner1Cd()
			);

		button1.appendChild(span1);

		const button2 = document.createElement('button');
		button2.type = 'button';
		button2.innerHTML = `${enemy.getSummoner2Name()}: `;

		const span2 = document.createElement('span');
		span2.innerHTML = 'UP';

		button2.onclick = () =>
			self.controller.handleSummonerClick(
				button2,
				span2,
				enemy.getSummoner2Cd()
			);

		button2.appendChild(span2);

		div2.appendChild(button1);
		div2.appendChild(button2);

		div.appendChild(p);
		div.appendChild(div2);

		li.appendChild(img);
		li.appendChild(div);

		return li;
	}
}

module.exports = MainView;
