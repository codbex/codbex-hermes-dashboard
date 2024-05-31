import { ProductRepository as ProductDao } from "codbex-products/gen/dao/Products/ProductRepository";
import { ProductCategoryRepository as CategoryDao } from "codbex-products/gen/dao/Categories/ProductCategoryRepository";
import { SalesInvoiceItemRepository as SalesInvoiceItemDao } from "codbex-invoices/gen/dao/salesinvoice/SalesInvoiceItemRepository";

import { Controller, Get } from "sdk/http";
import { query } from "sdk/db";
import { response } from "sdk/http";

@Controller
class ProductService {

    private readonly productDao;
    private readonly categoryDao;
    private readonly salesInvoiceItemDao;

    constructor() {
        this.productDao = new ProductDao();
        this.categoryDao = new CategoryDao();
        this.salesInvoiceItemDao = new SalesInvoiceItemDao();
    }

    @Get("/productData")
    public productData() {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const allProducts = this.productDao.findAll();
        let activeProducts = this.productDao.findAll({
            $filter: {
                equals: {
                    Enabled: true
                }
            }
        }).length;
        let inactiveProducts = this.productDao.findAll({
            $filter: {
                equals: {
                    Enabled: false
                }
            }
        }).length;

        const activeCategories: number = this.categoryDao.count();

        const sql = "SELECT p.PRODUCT_NAME as NAME, COUNT(si.SALESINVOICEITEM_ID) AS ORDER_COUNT, SUM(si.SALESINVOICEITEM_GROSS) AS REVENUE_SUM FROM CODBEX_PRODUCT p JOIN CODBEX_SALESINVOICEITEM si ON p.PRODUCT_ID = si.SALESINVOICEITEM_PRODUCT GROUP BY p.PRODUCT_ID, p.PRODUCT_NAME ORDER BY order_count DESC LIMIT 5";
        let resultset = query.execute(sql);

        const topProducts = resultset.map(row => ({
            productName: row.NAME,
            orderCount: row.ORDER_COUNT,
            revenue: row.REVENUE_SUM
        }));

        return {
            "ActiveProducts": activeProducts,
            "InactiveProducts": inactiveProducts,
            "AllProducts": allProducts.length,
            "ActiveCategories": activeCategories,
            "TopProducts": topProducts
        };
    }
}