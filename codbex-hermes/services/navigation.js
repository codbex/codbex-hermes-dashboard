const perspectiveData = {
	id: "codbex-hermes-launchpad",
	name: "Hermes",
	link: "../codbex-hermes/index.html",
	order: "0",
	icon: "../codbex-hermes/images/navigation.svg",
};

if (typeof exports !== 'undefined') {
	exports.getPerspective = function () {
		return perspectiveData;
	}
}
