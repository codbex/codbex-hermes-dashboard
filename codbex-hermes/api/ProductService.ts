// import { ProductRepository as ProductDao } from "codbex-products/gen/dao/Products/ProductRepository";
// import { ProductCategoryRepository as CategoryDao } from "codbex-products/gen/dao/Categories/ProductCategoryRepository";

// import { Controller, Get } from "sdk/http";
// import { query } from "sdk/db";
// import { response } from "sdk/http";

// @Controller
// class ProductService {

//     private readonly productDao;
//     private readonly categoryDao;

//     constructor() {
//         this.productDao = new ProductDao();
//         this.categoryDao = new CategoryDao();
//     }

//     @Get("/productData")
//     public productData() {
//         const currentDate = new Date();
//         currentDate.setHours(0, 0, 0, 0);

//         const allProducts = this.productDao.findAll();
//         let activeProducts = this.productDao.findAll({
//             $filter: {
//                 equals: {
//                     Enabled: true
//                 }
//             }
//         }).length;
//         let inactiveProducts = this.productDao.findAll({
//             $filter: {
//                 equals: {
//                     Enabled: false
//                 }
//             }
//         }).length;

//         const activeCategories: number = this.categoryDao.count();

//         const topProducts = resultset.map(row => ({
//             productName: row.NAME,
//             orderCount: row.ORDER_COUNT,
//             revenue: row.REVENUE_SUM
//         }));

//         return {
//             "ActiveProducts": activeProducts,
//             "InactiveProducts": inactiveProducts,
//             "AllProducts": allProducts.length,
//             "ActiveCategories": activeCategories,
//             "TopProducts": topProducts
//         };
//     }
// }