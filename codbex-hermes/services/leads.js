const viewData = {
    id: "codbex-hermes-leads",
    label: "Leads",
    lazyLoad: true,
    link: "/services/web/codbex-opportunities/gen/codbex-opportunities/ui/Lead/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}