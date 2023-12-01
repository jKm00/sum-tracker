const ShortcutService = require('../services/ShortcutService');

let self = null;

class ShortcutController {
	constructor() {
		if (!self) {
			this.shortCutView = null;
			this.shortcutService = new ShortcutService();
			self = this;
		}
		return self;
	}

	setView(view) {
		self.shortcutView = view;
	}
}

module.exports = ShortcutController;
