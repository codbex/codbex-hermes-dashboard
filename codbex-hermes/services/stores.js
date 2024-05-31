const viewData = {
    id: "codbex-hermes-stores",
    label: "Stores",
    lazyLoad: true,
    link: "/services/web/codbex-inventory/gen/ui/Stores/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}