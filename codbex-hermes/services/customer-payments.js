const viewData = {
    id: "codbex-hermes-customer-payments",
    label: "Customer Payments",
    lazyLoad: true,
    link: "/services/web/codbex-payments/gen/codbex-payments/ui/CustomerPayment/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}