import { SalesInvoiceRepository as SalesInvoiceDao } from "codbex-invoices/gen/dao/salesinvoice/SalesInvoiceRepository";
import { PurchaseInvoiceRepository as PurchaseInvoiceDao } from "codbex-invoices/gen/dao/purchaseinvoice/PurchaseInvoiceRepository";

import { Controller, Get } from "sdk/http";

@Controller
class InvoiceService {

    private readonly salesInvoiceDao;
    private readonly purchaseInvoiceDao;

    constructor() {
        this.salesInvoiceDao = new SalesInvoiceDao();
        this.purchaseInvoiceDao = new PurchaseInvoiceDao();
    }

    @Get("/invoiceData")
    public invoiceData() {
        let salesInvoiceTotal: number = 0.0;
        let purchaseInvoiceTotal: number = 0.0;
        let totalNotDue: number = 0;
        let totalDue: number = 0;
        const currentDate = new Date();

        const salesInvoicesNotDue = this.salesInvoiceDao.findAll({
            $filter: {
                greaterThanOrEqual: {
                    Due: currentDate
                }
            }
        });

        salesInvoicesNotDue.forEach(salesInvoice => {
            totalNotDue += salesInvoice.Total;
            salesInvoiceTotal += salesInvoice.Total;
        });

        const salesInvoicesDue = this.salesInvoiceDao.findAll({
            $filter: {
                lessThan: {
                    Due: currentDate
                }
            }
        });

        salesInvoicesDue.forEach(salesInvoice => {
            totalDue += salesInvoice.Total;
            salesInvoiceTotal += salesInvoice.Total;
        });

        const purchaseInvoicesNotDue = this.purchaseInvoiceDao.findAll({
            $filter: {
                greaterThanOrEqual: {
                    Due: currentDate
                }
            }
        });

        purchaseInvoicesNotDue.forEach(purchaseInvoice => {
            totalNotDue += purchaseInvoice.Total;
            purchaseInvoiceTotal += purchaseInvoice.Total;
        });

        const purchaseInvoicesDue = this.purchaseInvoiceDao.findAll({
            $filter: {
                lessThan: {
                    Due: currentDate
                }
            }
        });

        purchaseInvoicesDue.forEach(purchaseInvoice => {
            totalDue += purchaseInvoice.Total;
            purchaseInvoiceTotal += purchaseInvoice.Total;
        });

        const unpaidSalesInvoices = this.salesInvoiceDao.count({
            $filter: {
                notEquals: {
                    //All invoices that don't have the status 'Paid'
                    SalesInvoiceStatus: 6
                }
            }
        });

        return {
            "UnpaidSalesInvoices": unpaidSalesInvoices,
            "SalesInvoiceTotal": salesInvoiceTotal,
            "PurchaseInvoiceTotal": purchaseInvoiceTotal,
            "ReceivableCurrent": totalNotDue,
            'ReceivableOverdue': totalDue
        };
    }
}