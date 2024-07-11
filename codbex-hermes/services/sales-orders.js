const viewData = {
    id: "codbex-hermes-sales-orders",
    label: "Sales Orders",
    lazyLoad: true,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/SalesOrder/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}