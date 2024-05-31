const viewData = {
    id: "codbex-hermes-companies",
    label: "Companies",
    lazyLoad: true,
    link: "/services/web/codbex-companies/gen/ui/Companies/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}