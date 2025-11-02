class CustomerModel {
    constructor(db) {
        this.db = db;
    }

    getAllCustomers() {
        return this.db.getCustomers().map(customer => CustomerDTO.fromJSON(customer));
    }

    getCustomerById(id) {
        const customer = this.db.getById('customers', id);
        return customer ? CustomerDTO.fromJSON(customer) : null;
    }

    createCustomer(customerData) {
        const id = this.db.generateId();
        const customerDTO = new CustomerDTO(id, customerData.name, customerData.phone, customerData.address);
        const errors = customerDTO.validate();

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const createdCustomer = this.db.create('customers', customerDTO.toJSON());
        return CustomerDTO.fromJSON(createdCustomer);
    }

    updateCustomer(id, customerData) {
        const customerDTO = new CustomerDTO(id, customerData.name, customerData.phone, customerData.address);
        const errors = customerDTO.validate();

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const updatedCustomer = this.db.update('customers', id, customerDTO.toJSON());
        return updatedCustomer ? CustomerDTO.fromJSON(updatedCustomer) : null;
    }

    deleteCustomer(id) {
        return this.db.delete('customers', id);
    }

    searchCustomers(query) {
        const customers = this.getAllCustomers();
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(query.toLowerCase()) ||
            customer.phone.includes(query) ||
            customer.address.toLowerCase().includes(query.toLowerCase())
        );
    }
}