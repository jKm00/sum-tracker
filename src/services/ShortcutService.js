const { ipcRenderer } = require('electron');
const CooldownService = require('./CooldownService');

let self = null;

class ShortcutService {
	constructor() {
		if (!self) {
			this.cooldownService = new CooldownService();
			this.shortcuts = this.initializeShortcuts();
			self = this;
			self.setupListener();
		}
		return self;
	}

	/**
	 * Starts to listen for the shortcut-triggered event
	 */
	setupListener() {
		ipcRenderer.on('shortcut-triggered', (_, shortcut) => {
			const foundShortcut = self.shortcuts.find((s) => s.key === shortcut);

			if (foundShortcut) {
				foundShortcut.action();
			}
		});
	}

	/**
	 * Initializes the shortcuts
	 * @returns a list of shortcuts
	 */
	// TODO: Read shortcuts from file
	initializeShortcuts() {
		const shourtcuts = [
			{
				key: 'CommandOrControl+f1',
				action: () => self.doAction('btn-01', 'cd-01'),
			},
			{
				key: 'Shift+f1',
				action: () => self.doAction('btn-02', 'cd-02'),
			},
			{
				key: 'CommandOrControl+f2',
				action: () => self.doAction('btn-11', 'cd-11'),
			},
			{
				key: 'Shift+f2',
				action: () => self.doAction('btn-12', 'cd-12'),
			},
			{
				key: 'CommandOrControl+f3',
				action: () => self.doAction('btn-21', 'cd-21'),
			},
			{
				key: 'Shift+f3',
				action: () => self.doAction('btn-22', 'cd-22'),
			},
			{
				key: 'CommandOrControl+f4',
				action: () => self.doAction('btn-31', 'cd-31'),
			},
			{
				key: 'Shift+f4',
				action: () => self.doAction('btn-32', 'cd-32'),
			},
			{
				key: 'CommandOrControl+f5',
				action: () => self.doAction('btn-41', 'cd-41'),
			},
			{
				key: 'Shift+f5',
				action: () => self.doAction('btn-42', 'cd-42'),
			},
		];

		shourtcuts.forEach((shortcut) => {
			ipcRenderer.send('register-shortcut', shortcut.key);
		});

		return shourtcuts;
	}

	/**
	 * Performs the action of the shortcut
	 * @param {*} buttonId id of the button this shortcut maps to
	 * @param {*} spanId id of the span this shortcut maps to
	 */
	doAction(buttonId, spanId) {
		const button = document.querySelector(`#${buttonId}`);
		const span = document.querySelector(`#${spanId}`);

		if (button && span) {
			const cd = button.dataset.cd;

			self.cooldownService.setSummonerOnCooldown(button, span, cd);
		}
	}
}

module.exports = ShortcutService;
