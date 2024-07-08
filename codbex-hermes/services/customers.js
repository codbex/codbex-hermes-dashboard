const viewData = {
    id: "codbex-hermes-customers",
    label: "Customers",
    lazyLoad: true,
    link: "/services/web/codbex-partners/gen/codbex-partners/ui/Customers/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}