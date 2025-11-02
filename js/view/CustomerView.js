class CustomerView {
    constructor() {
        this.section = $('#customers-section');
        this.tableBody = $('#customers-table-body');
        this.customerForm = $('#customer-form');
        this.init();
    }

    init() {
        // Initialize form validation
        this.setupFormValidation();
    }

    setupFormValidation() {
        // Real-time validation
        $('#customer-name').on('input', this.validateName.bind(this));
        $('#customer-phone').on('input', this.validatePhone.bind(this));
    }

    validateName() {
        const nameInput = $('#customer-name');
        const name = nameInput.val().trim();

        if (name.length < 2) {
            nameInput.addClass('is-invalid');
            return false;
        } else {
            nameInput.removeClass('is-invalid');
            return true;
        }
    }

    validatePhone() {
        const phoneInput = $('#customer-phone');
        const phone = phoneInput.val().trim();
        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(phone.replace(/-/g, ''))) {
            phoneInput.addClass('is-invalid');
            return false;
        } else {
            phoneInput.removeClass('is-invalid');
            return true;
        }
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
            this.tableBody.append(`
                <tr>
                    <td colspan="5" class="text-center py-4">
                        <div class="text-muted">
                            <i class="fas fa-users fa-2x mb-3"></i>
                            <p>No customers found</p>
                            <button class="btn btn-primary btn-sm" id="add-first-customer">
                                <i class="fas fa-plus me-1"></i>Add First Customer
                            </button>
                        </div>
                    </td>
                </tr>
            `);
        } else {
            customers.forEach(customer => {
                this.tableBody.append(`
                    <tr>
                        <td>${customer.id}</td>
                        <td>
                            <strong>${this.escapeHtml(customer.name)}</strong>
                        </td>
                        <td>${this.formatPhone(customer.phone)}</td>
                        <td>${this.escapeHtml(customer.address || 'N/A')}</td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-warning edit-customer" data-id="${customer.id}" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-danger delete-customer" data-id="${customer.id}" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
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
            $('#customer-address').val(customer.address || '');
        } else {
            title.text('Add New Customer');
            $('#customer-form-data')[0].reset();
            $('#customer-id').val('');
            // Clear validation states
            $('#customer-name, #customer-phone').removeClass('is-invalid');
        }

        this.customerForm.removeClass('hidden');
        $('#customer-name').focus();
    }

    hideCustomerForm() {
        this.customerForm.addClass('hidden');
        $('#customer-form-data')[0].reset();
        $('#customer-name, #customer-phone').removeClass('is-invalid');
    }

    validateForm() {
        const isNameValid = this.validateName();
        const isPhoneValid = this.validatePhone();

        return isNameValid && isPhoneValid;
    }

    getFormData() {
        return {
            id: $('#customer-id').val(),
            name: $('#customer-name').val().trim(),
            phone: $('#customer-phone').val().trim(),
            address: $('#customer-address').val().trim()
        };
    }

    // Utility methods
    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    formatPhone(phone) {
        if (!phone) return '';
        // Format as XXX-XXX-XXXX
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
        return phone;
    }

    // Event binding methods
    bindAddCustomer(handler) {
        $('#add-customer-btn').on('click', () => handler());
        $(document).on('click', '#add-first-customer', () => handler());
    }

    bindSaveCustomer(handler) {
        $('#customer-form-data').on('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                const customerData = this.getFormData();
                handler(customerData);
            } else {
                this.showAlert('Please fix the validation errors', 'error');
            }
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
            const customerName = $(this).closest('tr').find('td:nth-child(2) strong').text();

            if (confirm(`Are you sure you want to delete customer "${customerName}"?`)) {
                handler(id);
            }
        });
    }

    bindCancelCustomer(handler) {
        $('#cancel-customer-btn').on('click', handler);
    }

    showAlert(message, type = 'success') {
        // Remove existing alerts
        $('.alert-dismissible').alert('close');

        const alertClass = type === 'error' ? 'danger' : type;
        const icon = type === 'error' ? 'exclamation-triangle' : 'check-circle';

        const alert = $(`
            <div class="alert alert-${alertClass} alert-dismissible fade show" role="alert">
                <i class="fas fa-${icon} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);

        // Add to page before the customer section
        this.section.before(alert);

        // Auto remove after 5 seconds
        setTimeout(() => {
            alert.alert('close');
        }, 5000);
    }

    showLoading() {
        this.tableBody.html(`
            <tr>
                <td colspan="5" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 text-muted">Loading customers...</p>
                </td>
            </tr>
        `);
    }
}