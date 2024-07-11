const viewData = {
    id: "codbex-hermes-purchase-orders-report",
    label: "Purchase Orders Report",
    lazyLoad: true,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/Reports/PurchaseOrdersReport/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}