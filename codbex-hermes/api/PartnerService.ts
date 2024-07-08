import { CustomerRepository as CustomerDao } from "codbex-partners/gen/codbex-partners/dao/Customers/CustomerRepository";
import { Controller, Get } from "sdk/http";

@Controller
class PartnerService {
    private readonly customerDao;

    constructor() {
        this.customerDao = new CustomerDao();
    }

}
