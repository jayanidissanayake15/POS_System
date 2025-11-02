class CustomerView {
    constructor() {
        this.section = $('#customers-section');
        this.tableBody = $('#customers-table-body');
        this.customerForm = $('#customer-form');
    }

    show() {
        this.section.removeClass('hidden');
    }

    hide() {
        this.section.addClass('hidden');
    }

    renderCustomers(customers) {
        this.tableBody.empty();

        if (customers.length === 0) {
            this.tableBody.append('<tr><td colspan="5" class="text-center">No customers found</td></tr>');
        } else {
            customers.forEach(customer => {
                this.tableBody.append(`
                    <tr>
                        <td>${customer.id}</td>
                        <td>${customer.name}</td>
                        <td>${customer.phone}</td>
                        <td>${customer.address}</td>
                        <td>
                            <button class="btn btn-sm btn-warning edit-customer" data-id="${customer.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-customer" data-id="${customer.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        }
    }

    showCustomerForm(customer = null) {
        const title = $('#customer-form-title');

        if (customer) {
            title.text('Edit Customer');
            $('#customer-id').val(customer.id);
            $('#customer-name').val(customer.name);
            $('#customer-phone').val(customer.phone);
            $('#customer-address').val(customer.address);
        } else {
            title.text('Add New Customer');
            $('#customer-form-data')[0].reset();
            $('#customer-id').val('');
        }

        this.customerForm.removeClass('hidden');
    }

    hideCustomerForm() {
        this.customerForm.addClass('hidden');
        $('#customer-form-data')[0].reset();
    }

    bindAddCustomer(handler) {
        $('#add-customer-btn').on('click', () => handler());
    }

    bindSaveCustomer(handler) {
        $('#customer-form-data').on('submit', (e) => {
            e.preventDefault();
            const customerData = {
                id: $('#customer-id').val(),
                name: $('#customer-name').val(),
                phone: $('#customer-phone').val(),
                address: $('#customer-address').val()
            };
            handler(customerData);
        });
    }

    bindEditCustomer(handler) {
        $(document).on('click', '.edit-customer', function() {
            const id = parseInt($(this).data('id'));
            handler(id);
        });
    }

    bindDeleteCustomer(handler) {
        $(document).on('click', '.delete-customer', function() {
            const id = parseInt($(this).data('id'));
            if (confirm('Are you sure you want to delete this customer?')) {
                handler(id);
            }
        });
    }

    bindCancelCustomer(handler) {
        $('#cancel-customer-btn').on('click', handler);
    }

    showAlert(message, type = 'success') {
        // Alert implementation
        alert(`${type.toUpperCase()}: ${message}`);
    }
}