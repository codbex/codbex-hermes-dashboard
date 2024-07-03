const viewData = {
    id: "codbex-hermes-catalogues",
    label: "Catalogues",
    lazyLoad: true,
    link: "/services/web/codbex-products/gen/codbex-products/ui/Catalogues/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}