const viewData = {
    id: "codbex-hermes-opportunities",
    label: "Opportunities",
    lazyLoad: true,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Opportunity/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}