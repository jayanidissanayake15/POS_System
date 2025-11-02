class CustomerController {
    constructor(customerModel, customerView) {
        this.customerModel = customerModel;
        this.customerView = customerView;

        this.init();
    }

    init() {
        this.customerView.bindAddCustomer(this.handleAddCustomer.bind(this));
        this.customerView.bindSaveCustomer(this.handleSaveCustomer.bind(this));
        this.customerView.bindEditCustomer(this.handleEditCustomer.bind(this));
        this.customerView.bindDeleteCustomer(this.handleDeleteCustomer.bind(this));
        this.customerView.bindCancelCustomer(this.handleCancelCustomer.bind(this));
    }

    showCustomers() {
        try {
            const customers = this.customerModel.getAllCustomers();
            this.customerView.renderCustomers(customers);
            this.customerView.show();
        } catch (error) {
            this.customerView.showAlert('Error loading customers: ' + error.message, 'error');
        }
    }

    handleAddCustomer() {
        this.customerView.showCustomerForm();
    }

    handleSaveCustomer(customerData) {
        try {
            if (customerData.id) {
                // Update existing customer
                const updatedCustomer = this.customerModel.updateCustomer(customerData.id, customerData);
                if (updatedCustomer) {
                    this.customerView.showAlert('Customer updated successfully');
                    this.showCustomers();
                    this.customerView.hideCustomerForm();
                }
            } else {
                // Create new customer
                const newCustomer = this.customerModel.createCustomer(customerData);
                this.customerView.showAlert('Customer created successfully');
                this.showCustomers();
                this.customerView.hideCustomerForm();
            }
        } catch (error) {
            this.customerView.showAlert('Error saving customer: ' + error.message, 'error');
        }
    }

    handleEditCustomer(id) {
        try {
            const customer = this.customerModel.getCustomerById(id);
            if (customer) {
                this.customerView.showCustomerForm(customer);
            }
        } catch (error) {
            this.customerView.showAlert('Error loading customer: ' + error.message, 'error');
        }
    }

    handleDeleteCustomer(id) {
        try {
            const success = this.customerModel.deleteCustomer(id);
            if (success) {
                this.customerView.showAlert('Customer deleted successfully');
                this.showCustomers();
            }
        } catch (error) {
            this.customerView.showAlert('Error deleting customer: ' + error.message, 'error');
        }
    }

    handleCancelCustomer() {
        this.customerView.hideCustomerForm();
    }

    getAllCustomers() {
        return this.customerModel.getAllCustomers();
    }

    getCustomerById(id) {
        return this.customerModel.getCustomerById(id);
    }
}