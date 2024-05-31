const viewData = {
    id: "codbex-hermes-sales-invoices",
    label: "Sales Invoices",
    lazyLoad: true,
    link: "/services/web/codbex-invoices/gen/ui/salesinvoice/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}