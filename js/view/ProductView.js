class ProductView {
    constructor() {
        this.section = $('#items-section');
        this.tableBody = $('#items-table-body');
        this.productForm = $('#item-form');
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
            this.tableBody.append('<tr><td colspan="5" class="text-center">No products found</td></tr>');
        } else {
            products.forEach(product => {
                this.tableBody.append(`
                    <tr>
                        <td>${product.code}</td>
                        <td>${product.name}</td>
                        <td>LKR ${product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>${product.quantity}</td>
                        <td>
                            <button class="btn btn-sm btn-warning edit-item" data-id="${product.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-item" data-id="${product.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
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
        }

        this.productForm.removeClass('hidden');
    }

    hideProductForm() {
        this.productForm.addClass('hidden');
        $('#item-form-data')[0].reset();
    }

    bindAddProduct(handler) {
        $('#add-item-btn').on('click', () => handler());
    }

    bindSaveProduct(handler) {
        $('#item-form-data').on('submit', (e) => {
            e.preventDefault();
            const productData = {
                id: $('#item-id').val(),
                code: $('#item-code').val(),
                name: $('#item-name').val(),
                price: $('#item-price').val(),
                quantity: $('#item-quantity').val()
            };
            handler(productData);
        });
    }

    bindEditProduct(handler) {
        $(document).on('click', '.edit-item', function() {
            const id = parseInt($(this).data('id'));
            handler(id);
        });
    }

    bindDeleteProduct(handler) {
        $(document).on('click', '.delete-item', function() {
            const id = parseInt($(this).data('id'));
            if (confirm('Are you sure you want to delete this product?')) {
                handler(id);
            }
        });
    }

    bindCancelProduct(handler) {
        $('#cancel-item-btn').on('click', handler);
    }

    showAlert(message, type = 'success') {
        alert(`${type.toUpperCase()}: ${message}`);
    }
}