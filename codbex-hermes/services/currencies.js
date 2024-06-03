const viewData = {
    id: "codbex-hermes-currencies",
    label: "Currencies",
    lazyLoad: true,
    link: "/services/web/codbex-currencies/gen/ui/Currencies/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}