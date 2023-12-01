const MainController = require('./controllers/MainController');
const MainView = require('./views/MainView');

window.onload = () => {
	const mainController = new MainController();
	const mainView = new MainView(mainController);
	mainView.init();
};
