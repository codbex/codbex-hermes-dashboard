const viewData = {
    id: "codbex-hermes-sales-orders-total-report",
    label: "Sales Orders Total Report",
    lazyLoad: true,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/Reports/SalesOrdersTotalReport/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}