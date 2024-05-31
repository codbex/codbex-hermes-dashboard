const viewData = {
    id: "codbex-hermes-quotations",
    label: "Quotations",
    lazyLoad: true,
    link: "/services/web/codbex-opportunities/gen/ui/Quotation/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}