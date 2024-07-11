const viewData = {
    id: "codbex-hermes-organisations",
    label: "Organisations",
    lazyLoad: true,
    link: "/services/web/codbex-employees/gen/codbex-employees/ui/Organisations/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}