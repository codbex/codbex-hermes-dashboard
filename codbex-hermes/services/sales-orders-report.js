const viewData = {
    id: "codbex-hermes-sales-orders-report",
    label: "Sales Orders Report",
    lazyLoad: true,
    link: "/services/web/codbex-orders/gen/ui/Reports/SalesOrdersReport/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}