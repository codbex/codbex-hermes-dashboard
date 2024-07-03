const viewData = {
    id: "codbex-hermes-categories",
    label: "Categories",
    lazyLoad: true,
    link: "/services/web/codbex-products/gen/codbex-products/ui/Categories/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}