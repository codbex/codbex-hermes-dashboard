const viewData = {
    id: "codbex-hermes-supplier-payments",
    label: "Supplier Payments",
    lazyLoad: true,
    link: "/services/web/codbex-payments/gen/ui/SupplierPayment/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}