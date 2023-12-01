const MainController = require('./controllers/MainController');
const MainView = require('./views/MainView');
const ShortcutController = require('./controllers/ShortcutController');
const ShortcutView = require('./views/ShortcutView');

window.onload = () => {
	const mainController = new MainController();
	const mainView = new MainView(mainController);
	mainView.init();
	const shortcutController = new ShortcutController();
	const shortcutView = new ShortcutView(shortcutController);
};
