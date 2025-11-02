class CustomerModel {
    constructor(db) {
        this.db = db;
        console.log('CustomerModel initialized with DB:', db);
    }

    getAllCustomers() {
        try {
            const customers = this.db.getCustomers();
            console.log('Retrieved customers from DB:', customers);
            return customers.map(customer => CustomerDTO.fromJSON(customer));
        } catch (error) {
            console.error('Error getting customers:', error);
            throw new Error('Failed to retrieve customers');
        }
    }

    getCustomerById(id) {
        try {
            const customer = this.db.getById('customers', id);
            return customer ? CustomerDTO.fromJSON(customer) : null;
        } catch (error) {
            console.error('Error getting customer by ID:', error);
            throw new Error('Failed to retrieve customer');
        }
    }

    createCustomer(customerData) {
        try {
            console.log('Creating customer with data:', customerData);
            const id = this.db.generateId();
            const customerDTO = new CustomerDTO(id, customerData.name, customerData.phone, customerData.address);
            const errors = customerDTO.validate();

            if (errors.length > 0) {
                throw new Error(errors.join(', '));
            }

            // Check for duplicate phone number
            const existingCustomer = this.getAllCustomers().find(c =>
                c.phone.replace(/-/g, '') === customerData.phone.replace(/-/g, '')
            );

            if (existingCustomer) {
                throw new Error('Customer with this phone number already exists');
            }

            const createdCustomer = this.db.create('customers', customerDTO.toJSON());
            console.log('Customer created successfully:', createdCustomer);
            return CustomerDTO.fromJSON(createdCustomer);
        } catch (error) {
            console.error('Error creating customer:', error);
            throw new Error('Failed to create customer: ' + error.message);
        }
    }

    updateCustomer(id, customerData) {
        try {
            console.log('Updating customer ID:', id, 'with data:', customerData);
            const customerDTO = new CustomerDTO(id, customerData.name, customerData.phone, customerData.address);
            const errors = customerDTO.validate();

            if (errors.length > 0) {
                throw new Error(errors.join(', '));
            }

            // Check for duplicate phone number (excluding current customer)
            const existingCustomer = this.getAllCustomers().find(c =>
                c.id !== id &&
                c.phone.replace(/-/g, '') === customerData.phone.replace(/-/g, '')
            );

            if (existingCustomer) {
                throw new Error('Another customer with this phone number already exists');
            }

            const updatedCustomer = this.db.update('customers', id, customerDTO.toJSON());
            console.log('Customer updated successfully:', updatedCustomer);
            return updatedCustomer ? CustomerDTO.fromJSON(updatedCustomer) : null;
        } catch (error) {
            console.error('Error updating customer:', error);
            throw new Error('Failed to update customer: ' + error.message);
        }
    }

    deleteCustomer(id) {
        try {
            console.log('Deleting customer ID:', id);
            const success = this.db.delete('customers', id);
            console.log('Customer deletion result:', success);
            return success;
        } catch (error) {
            console.error('Error deleting customer:', error);
            throw new Error('Failed to delete customer');
        }
    }

    searchCustomers(query) {
        try {
            const customers = this.getAllCustomers();
            return customers.filter(customer =>
                customer.name.toLowerCase().includes(query.toLowerCase()) ||
                customer.phone.includes(query) ||
                (customer.address && customer.address.toLowerCase().includes(query.toLowerCase()))
            );
        } catch (error) {
            console.error('Error searching customers:', error);
            throw new Error('Failed to search customers');
        }
    }
}