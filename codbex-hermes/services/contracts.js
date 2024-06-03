const viewData = {
    id: "codbex-hermes-contracts",
    label: "Contracts",
    lazyLoad: true,
    link: "/services/web/codbex-contracts/gen/ui/Contract/index.html?embedded"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}