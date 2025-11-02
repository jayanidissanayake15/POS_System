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

        console.log('CustomerController initialized');
    }

    showCustomers() {
        try {
            this.customerView.showLoading();
            const customers = this.customerModel.getAllCustomers();
            this.customerView.renderCustomers(customers);
            this.customerView.show();

            console.log(`Loaded ${customers.length} customers`);
        } catch (error) {
            console.error('Error loading customers:', error);
            this.customerView.showAlert('Error loading customers: ' + error.message, 'error');
        }
    }

    handleAddCustomer() {
        console.log('Add customer clicked');
        this.customerView.showCustomerForm();
    }

    handleSaveCustomer(customerData) {
        try {
            console.log('Saving customer:', customerData);

            if (customerData.id) {
                // Update existing customer
                const updatedCustomer = this.customerModel.updateCustomer(customerData.id, customerData);
                if (updatedCustomer) {
                    this.customerView.showAlert('Customer updated successfully');
                    this.showCustomers();
                    this.customerView.hideCustomerForm();
                } else {
                    this.customerView.showAlert('Customer not found', 'error');
                }
            } else {
                // Create new customer
                const newCustomer = this.customerModel.createCustomer(customerData);
                this.customerView.showAlert('Customer created successfully');
                this.showCustomers();
                this.customerView.hideCustomerForm();

                // Notify dashboard to refresh stats
                if (this.onCustomerUpdate) {
                    this.onCustomerUpdate();
                }
            }
        } catch (error) {
            console.error('Error saving customer:', error);
            this.customerView.showAlert('Error saving customer: ' + error.message, 'error');
        }
    }

    handleEditCustomer(id) {
        try {
            console.log('Editing customer ID:', id);
            const customer = this.customerModel.getCustomerById(id);
            if (customer) {
                this.customerView.showCustomerForm(customer);
            } else {
                this.customerView.showAlert('Customer not found', 'error');
            }
        } catch (error) {
            console.error('Error loading customer:', error);
            this.customerView.showAlert('Error loading customer: ' + error.message, 'error');
        }
    }

    handleDeleteCustomer(id) {
        try {
            console.log('Deleting customer ID:', id);
            const success = this.customerModel.deleteCustomer(id);
            if (success) {
                this.customerView.showAlert('Customer deleted successfully');
                this.showCustomers();

                // Notify dashboard to refresh stats
                if (this.onCustomerUpdate) {
                    this.onCustomerUpdate();
                }
            } else {
                this.customerView.showAlert('Customer not found', 'error');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            this.customerView.showAlert('Error deleting customer: ' + error.message, 'error');
        }
    }

    handleCancelCustomer() {
        this.customerView.hideCustomerForm();
    }

    // Public methods for other controllers
    getAllCustomers() {
        return this.customerModel.getAllCustomers();
    }

    getCustomerById(id) {
        return this.customerModel.getCustomerById(id);
    }

    getCustomersCount() {
        return this.customerModel.getAllCustomers().length;
    }

    // Callback for dashboard updates
    setOnCustomerUpdate(callback) {
        this.onCustomerUpdate = callback;
    }
}