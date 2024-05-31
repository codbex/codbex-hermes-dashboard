const viewData = {
    id: "codbex-hermes-dashboard",
    label: "Dashboard",
    lazyLoad: true,
    link: "/services/web/codbex-hermes/subviews/dashboard.html"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}