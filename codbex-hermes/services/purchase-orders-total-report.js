const viewData = {
    id: "codbex-hermes-purchase-orders-total-report",
    label: "Purchase Orders Total Report",
    lazyLoad: true,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/Reports/PurchaseOrdersTotalReport/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}