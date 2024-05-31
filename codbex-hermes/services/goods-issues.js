const viewData = {
    id: "codbex-hermes-goods-issues",
    label: "Goods Issues",
    lazyLoad: true,
    link: "/services/web/codbex-inventory/gen/ui/GoodsIssues/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}