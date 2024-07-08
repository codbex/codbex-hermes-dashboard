const viewData = {
    id: "codbex-hermes-cities",
    label: "Cities",
    lazyLoad: true,
    link: "/services/web/codbex-cities/gen/codbex-cities/ui/Cities/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}