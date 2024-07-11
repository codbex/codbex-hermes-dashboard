const viewData = {
    id: "codbex-hermes-purchase-orders",
    label: "Purchase Orders",
    lazyLoad: true,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/PurchaseOrder/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}