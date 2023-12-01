let self = null;

class ShortcutView {
	constructor(controller) {
		if (!self) {
			this.controller = controller;
			this.controller.setView(this);
			this.init();
			self = this;
		}
		return self;
	}

	init() {
		const div = document.querySelector('#shortcuts');

		const title = document.createElement('h2');
		title.innerHTML = 'Shortcuts';

		div.appendChild(title);
	}
}

module.exports = ShortcutView;
