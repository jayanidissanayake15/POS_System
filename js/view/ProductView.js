class ProductView {
    constructor() {
        this.section = $('#items-section');
        this.tableBody = $('#items-table-body');
        this.productForm = $('#item-form');
        this.productsCount = $('#products-count');
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupSearchAndFilters();
    }

    setupFormValidation() {
        // Real-time validation
        $('#item-code').on('input', this.validateCode.bind(this));
        $('#item-name').on('input', this.validateName.bind(this));
        $('#item-price').on('input', this.validatePrice.bind(this));
        $('#item-quantity').on('input', this.validateQuantity.bind(this));
    }

    setupSearchAndFilters() {
        // Search functionality
        $('#product-search').on('input', () => {
            if (this.onSearch) {
                this.onSearch($('#product-search').val());
            }
        });

        // Stock filter
        $('#stock-filter').on('change', () => {
            if (this.onFilter) {
                this.onFilter($('#stock-filter').val());
            }
        });

        // Clear filters
        $('#clear-filters').on('click', () => {
            $('#product-search').val('');
            $('#stock-filter').val('all');
            if (this.onClearFilters) {
                this.onClearFilters();
            }
        });
    }

    validateCode() {
        const codeInput = $('#item-code');
        const code = codeInput.val().trim();

        if (code.length < 3) {
            codeInput.addClass('is-invalid');
            return false;
        } else {
            codeInput.removeClass('is-invalid');
            return true;
        }
    }

    validateName() {
        const nameInput = $('#item-name');
        const name = nameInput.val().trim();

        if (name.length < 2) {
            nameInput.addClass('is-invalid');
            return false;
        } else {
            nameInput.removeClass('is-invalid');
            return true;
        }
    }

    validatePrice() {
        const priceInput = $('#item-price');
        const price = parseFloat(priceInput.val());

        if (isNaN(price) || price < 0) {
            priceInput.addClass('is-invalid');
            return false;
        } else {
            priceInput.removeClass('is-invalid');
            return true;
        }
    }

    validateQuantity() {
        const quantityInput = $('#item-quantity');
        const quantity = parseInt(quantityInput.val());

        if (isNaN(quantity) || quantity < 0) {
            quantityInput.addClass('is-invalid');
            return false;
        } else {
            quantityInput.removeClass('is-invalid');
            return true;
        }
    }

    show() {
        this.section.removeClass('hidden');
    }

    hide() {
        this.section.addClass('hidden');
    }

    renderProducts(products) {
        this.tableBody.empty();

        if (products.length === 0) {
            this.tableBody.append(`
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <div class="text-muted">
                            <i class="fas fa-boxes fa-2x mb-3"></i>
                            <p>No products found</p>
                            <button class="btn btn-primary btn-sm" id="add-first-product">
                                <i class="fas fa-plus me-1"></i>Add First Product
                            </button>
                        </div>
                    </td>
                </tr>
            `);
        } else {
            products.forEach(product => {
                const stockStatus = this.getStockStatus(product.quantity);
                const statusClass = this.getStatusClass(stockStatus);

                this.tableBody.append(`
                    <tr>
                        <td>
                            <strong class="font-monospace">${this.escapeHtml(product.code)}</strong>
                        </td>
                        <td>${this.escapeHtml(product.name)}</td>
                        <td class="fw-bold">LKR ${product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>
                            <span class="badge bg-secondary">${product.quantity}</span>
                        </td>
                        <td>
                            <span class="badge ${statusClass}">${stockStatus}</span>
                        </td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-warning edit-item" data-id="${product.id}" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-info view-item" data-id="${product.id}" title="View Details">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-outline-danger delete-item" data-id="${product.id}" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `);
            });
        }

        this.updateProductsCount(products.length);
    }

    updateProductsCount(count) {
        this.productsCount.text(`${count} product${count !== 1 ? 's' : ''}`);
    }

    getStockStatus(quantity) {
        if (quantity === 0) return 'Out of Stock';
        if (quantity <= 10) return 'Low Stock';
        return 'In Stock';
    }

    getStatusClass(status) {
        switch (status) {
            case 'In Stock': return 'bg-success';
            case 'Low Stock': return 'bg-warning';
            case 'Out of Stock': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    showProductForm(product = null) {
        const title = $('#item-form-title');

        if (product) {
            title.text('Edit Product');
            $('#item-id').val(product.id);
            $('#item-code').val(product.code);
            $('#item-name').val(product.name);
            $('#item-price').val(product.price);
            $('#item-quantity').val(product.quantity);
        } else {
            title.text('Add New Product');
            $('#item-form-data')[0].reset();
            $('#item-id').val('');
            // Clear validation states
            $('#item-code, #item-name, #item-price, #item-quantity').removeClass('is-invalid');
        }

        this.productForm.removeClass('hidden');
        $('#item-code').focus();
    }

    hideProductForm() {
        this.productForm.addClass('hidden');
        $('#item-form-data')[0].reset();
        $('#item-code, #item-name, #item-price, #item-quantity').removeClass('is-invalid');
    }

    validateForm() {
        const isCodeValid = this.validateCode();
        const isNameValid = this.validateName();
        const isPriceValid = this.validatePrice();
        const isQuantityValid = this.validateQuantity();

        return isCodeValid && isNameValid && isPriceValid && isQuantityValid;
    }

    getFormData() {
        return {
            id: $('#item-id').val(),
            code: $('#item-code').val().trim(),
            name: $('#item-name').val().trim(),
            price: parseFloat($('#item-price').val()),
            quantity: parseInt($('#item-quantity').val())
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

    // Event binding methods
    bindAddProduct(handler) {
        $('#add-item-btn').on('click', () => handler());
        $(document).on('click', '#add-first-product', () => handler());
    }

    bindSaveProduct(handler) {
        $('#item-form-data').on('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                const productData = this.getFormData();
                handler(productData);
            } else {
                this.showAlert('Please fix the validation errors', 'error');
            }
        });
    }

    bindEditProduct(handler) {
        $(document).on('click', '.edit-item', function() {
            const id = parseInt($(this).data('id'));
            handler(id);
        });
    }

    bindViewProduct(handler) {
        $(document).on('click', '.view-item', function() {
            const id = parseInt($(this).data('id'));
            handler(id);
        });
    }

    bindDeleteProduct(handler) {
        $(document).on('click', '.delete-item', function() {
            const id = parseInt($(this).data('id'));
            const productName = $(this).closest('tr').find('td:nth-child(2)').text();

            if (confirm(`Are you sure you want to delete product "${productName}"?`)) {
                handler(id);
            }
        });
    }

    bindCancelProduct(handler) {
        $('#cancel-item-btn').on('click', handler);
    }

    bindSearch(handler) {
        this.onSearch = handler;
    }

    bindFilter(handler) {
        this.onFilter = handler;
    }

    bindClearFilters(handler) {
        this.onClearFilters = handler;
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

        // Add to page before the product section
        this.section.before(alert);

        // Auto remove after 5 seconds
        setTimeout(() => {
            alert.alert('close');
        }, 5000);
    }

    showLoading() {
        this.tableBody.html(`
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 text-muted">Loading products...</p>
                </td>
            </tr>
        `);
    }

    clearSearchAndFilters() {
        $('#product-search').val('');
        $('#stock-filter').val('all');
    }
}