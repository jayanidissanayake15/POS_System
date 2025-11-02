class OrderView {
    constructor() {
        this.section = $('#orders-section');
        this.orderHistorySection = $('#order-history-section');
        this.orderItems = $('#order-items');
        this.availableItemsList = $('#available-items-list');
        this.customerSelect = $('#order-customer');
        this.customerDetails = $('#customer-details');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Customer selection change
        this.customerSelect.on('change', this.handleCustomerChange.bind(this));

        // Product search in order section
        $('#product-search-order').on('input', this.handleProductSearch.bind(this));
    }

    show() {
        this.section.removeClass('hidden');
    }

    hide() {
        this.section.addClass('hidden');
    }

    showOrderHistory() {
        this.orderHistorySection.removeClass('hidden');
    }

    hideOrderHistory() {
        this.orderHistorySection.addClass('hidden');
    }

    renderCustomers(customers) {
        this.customerSelect.empty();
        this.customerSelect.append('<option value="">Choose a customer...</option>');

        customers.forEach(customer => {
            this.customerSelect.append(`<option value="${customer.id}">${customer.name} - ${customer.phone}</option>`);
        });

        // Also populate customer filter in order history
        const customerFilter = $('#customer-filter');
        customerFilter.empty();
        customerFilter.append('<option value="all">All Customers</option>');
        customers.forEach(customer => {
            customerFilter.append(`<option value="${customer.id}">${customer.name}</option>`);
        });
    }

    renderAvailableProducts(products) {
        this.availableItemsList.empty();

        if (products.length === 0) {
            this.availableItemsList.append(`
                <div class="list-group-item text-center text-muted py-4">
                    <i class="fas fa-box-open fa-2x mb-3"></i>
                    <p>No products available</p>
                    <small>Add products in the Products section first</small>
                </div>
            `);
        } else {
            products.forEach(product => {
                const stockStatus = this.getStockStatus(product.quantity);
                const statusClass = this.getStatusClass(stockStatus);

                this.availableItemsList.append(`
                    <div class="list-group-item list-group-item-action pointer available-item" data-id="${product.id}">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <h6 class="mb-1">${this.escapeHtml(product.name)}</h6>
                                <small class="text-muted">${this.escapeHtml(product.code)}</small>
                                <div class="mt-1">
                                    <strong class="text-primary">LKR ${product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                                </div>
                            </div>
                            <div class="text-end">
                                <span class="badge ${statusClass}">${stockStatus}</span>
                                <div class="mt-1 small text-muted">${product.quantity} in stock</div>
                            </div>
                        </div>
                    </div>
                `);
            });
        }
    }

    handleCustomerChange() {
        const customerId = this.customerSelect.val();
        if (customerId && this.onCustomerSelect) {
            this.onCustomerSelect(customerId);
        }
        this.updatePlaceOrderButton();
    }

    handleProductSearch() {
        const query = $('#product-search-order').val().toLowerCase();
        $('.available-item').each(function() {
            const productText = $(this).text().toLowerCase();
            $(this).toggle(productText.includes(query));
        });
    }

    showCustomerDetails(customer) {
        if (customer) {
            this.customerDetails.html(`
                <div class="fw-bold">${this.escapeHtml(customer.name)}</div>
                <div>${this.escapeHtml(customer.phone)}</div>
                <div class="small">${this.escapeHtml(customer.address || 'No address')}</div>
            `);
        } else {
            this.customerDetails.html('<span class="text-muted">Select a customer to view details</span>');
        }
    }

    addItemToOrder(item) {
        // Check if item already exists in order
        const existingItem = $(`.order-item[data-id="${item.id}"]`);
        if (existingItem.length > 0) {
            this.increaseItemQuantity(existingItem, item);
            return;
        }

        // Remove empty state if exists
        if ($('#order-items .text-center').length > 0) {
            this.orderItems.empty();
        }

        const orderItem = $(`
            <div class="order-item border-bottom pb-3 mb-3" data-id="${item.id}">
                <div class="row align-items-center">
                    <div class="col-md-5">
                        <h6 class="mb-1">${this.escapeHtml(item.name)}</h6>
                        <small class="text-muted">${this.escapeHtml(item.code)}</small>
                        <div class="mt-1">
                            <strong class="text-success">LKR ${item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-secondary decrease-quantity" type="button">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="form-control text-center item-quantity" value="1" min="1" max="${item.quantity}">
                            <button class="btn btn-outline-secondary increase-quantity" type="button">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <small class="text-muted">Max: ${item.quantity}</small>
                    </div>
                    <div class="col-md-2">
                        <strong class="item-total">LKR ${item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-outline-danger btn-sm remove-item">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `);

        this.orderItems.append(orderItem);
        this.updateOrderSummary();
        this.updateItemsCount();
        this.updatePlaceOrderButton();
    }

    increaseItemQuantity(itemElement, item) {
        const quantityInput = itemElement.find('.item-quantity');
        const currentQuantity = parseInt(quantityInput.val());
        if (currentQuantity < item.quantity) {
            quantityInput.val(currentQuantity + 1);
            this.updateItemTotal(itemElement, item.price);
            this.updateOrderSummary();
        } else {
            this.showAlert(`Only ${item.quantity} units of ${item.name} available`, 'warning');
        }
    }

    updateItemTotal(itemElement, price) {
        const quantity = parseInt(itemElement.find('.item-quantity').val());
        const total = (quantity * price);
        itemElement.find('.item-total').text('LKR ' + total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    }

    updateOrderSummary() {
        let subtotal = 0;
        $('.order-item').each(function() {
            const itemTotalText = $(this).find('.item-total').text().replace('LKR ', '').replace(/,/g, '');
            const itemTotal = parseFloat(itemTotalText);
            subtotal += itemTotal;
        });

        const tax = 0; // You can add tax calculation here
        const total = subtotal + tax;

        $('#order-subtotal').text('LKR ' + subtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
        $('#order-tax').text('LKR ' + tax.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
        $('#order-total').text('LKR ' + total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    }

    updateItemsCount() {
        const count = $('.order-item').length;
        $('#items-count').text(`${count} item${count !== 1 ? 's' : ''}`);
    }

    updatePlaceOrderButton() {
        const hasCustomer = this.customerSelect.val() !== '';
        const hasItems = $('.order-item').length > 0;
        $('#place-order-btn').prop('disabled', !(hasCustomer && hasItems));
    }

    clearOrderForm() {
        this.customerSelect.val('');
        this.customerDetails.html('<span class="text-muted">Select a customer to view details</span>');
        this.orderItems.html(`
            <div class="text-center text-muted py-4">
                <i class="fas fa-cart-plus fa-2x mb-3"></i>
                <p>No items added to order</p>
                <small>Click on products from the available list to add them</small>
            </div>
        `);
        this.updateOrderSummary();
        this.updateItemsCount();
        this.updatePlaceOrderButton();
    }

    getOrderData() {
        const customerId = this.customerSelect.val();
        const items = [];

        $('.order-item').each(function() {
            const itemId = parseInt($(this).data('id'));
            const quantity = parseInt($(this).find('.item-quantity').val());
            const itemName = $(this).find('h6').text();
            const itemPriceText = $(this).find('.text-success').text().replace('LKR ', '').replace(/,/g, '');
            const itemPrice = parseFloat(itemPriceText);

            items.push({
                id: itemId,
                name: itemName,
                price: itemPrice,
                quantity: quantity
            });
        });

        const total = parseFloat($('#order-total').text().replace('LKR ', '').replace(/,/g, ''));

        return {
            customerId: customerId,
            items: items,
            total: total
        };
    }

    // Order History Methods
    renderOrderHistory(orders) {
        const tbody = $('#order-history-table-body');
        tbody.empty();

        if (orders.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <div class="text-muted">
                            <i class="fas fa-receipt fa-2x mb-3"></i>
                            <p>No orders found</p>
                        </div>
                    </td>
                </tr>
            `);
        } else {
            orders.forEach(order => {
                const itemsList = order.items.map(item =>
                    `${item.name} (${item.quantity})`
                ).join(', ');

                const statusClass = this.getOrderStatusClass(order.status);

                tbody.append(`
                    <tr>
                        <td>
                            <strong>#${order.id}</strong>
                        </td>
                        <td>${this.escapeHtml(order.customerName)}</td>
                        <td>
                            <small title="${itemsList}">${itemsList.length > 50 ? itemsList.substring(0, 50) + '...' : itemsList}</small>
                        </td>
                        <td class="fw-bold">LKR ${order.total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td>${new Date(order.date).toLocaleDateString()}</td>
                        <td>
                            <span class="badge ${statusClass}">${order.status}</span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-outline-info view-order" data-id="${order.id}" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });
        }

        this.updateOrdersCount(orders.length);
    }

    updateOrdersCount(count) {
        $('#orders-count').text(`${count} order${count !== 1 ? 's' : ''}`);
    }

    getOrderStatusClass(status) {
        switch (status) {
            case 'completed': return 'bg-success';
            case 'pending': return 'bg-warning';
            case 'cancelled': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    // Utility Methods
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

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Event Binding Methods
    bindAddItemToOrder(handler) {
        $(document).on('click', '.available-item', function() {
            const id = parseInt($(this).data('id'));
            handler(id);
        });
    }

    bindQuantityChange(handler) {
        $(document).on('change', '.item-quantity', function() {
            handler($(this));
        });

        $(document).on('click', '.increase-quantity', function() {
            const input = $(this).closest('.input-group').find('.item-quantity');
            input.val(parseInt(input.val()) + 1);
            input.trigger('change');
        });

        $(document).on('click', '.decrease-quantity', function() {
            const input = $(this).closest('.input-group').find('.item-quantity');
            const currentVal = parseInt(input.val());
            if (currentVal > 1) {
                input.val(currentVal - 1);
                input.trigger('change');
            }
        });
    }

    bindRemoveItem(handler) {
        $(document).on('click', '.remove-item', function() {
            handler($(this));
        });
    }

    bindPlaceOrder(handler) {
        $('#place-order-btn').on('click', handler);
    }

    bindClearOrder(handler) {
        $('#clear-order-btn').on('click', handler);
    }

    bindAddSampleItems(handler) {
        $('#add-sample-items').on('click', handler);
    }

    bindCustomerSelect(handler) {
        this.onCustomerSelect = handler;
    }

    // Order History Event Bindings
    bindRefreshOrders(handler) {
        $('#refresh-orders').on('click', handler);
    }

    bindOrderFilters(handler) {
        $('#date-filter, #customer-filter, #status-filter').on('change', handler);
    }

    bindClearOrderFilters(handler) {
        $('#clear-order-filters').on('click', handler);
    }

    bindViewOrder(handler) {
        $(document).on('click', '.view-order', function() {
            const id = parseInt($(this).data('id'));
            handler(id);
        });
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

        // Add to page before the current section
        this.section.before(alert);

        // Auto remove after 5 seconds
        setTimeout(() => {
            alert.alert('close');
        }, 5000);
    }

    showOrderSuccess(order) {
        const modalHtml = `
            <div class="modal fade" id="orderSuccessModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="fas fa-check-circle me-2"></i>Order Placed Successfully!
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center mb-4">
                                <i class="fas fa-receipt fa-3x text-success mb-3"></i>
                                <h4>Order #${order.id}</h4>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <strong>Customer:</strong><br>
                                    ${this.escapeHtml(order.customerName)}
                                </div>
                                <div class="col-md-6">
                                    <strong>Total:</strong><br>
                                    LKR ${order.total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </div>
                            </div>
                            <div class="mt-3">
                                <strong>Items:</strong>
                                <ul class="list-group list-group-flush mt-2">
                                    ${order.items.map(item => `
                                        <li class="list-group-item d-flex justify-content-between">
                                            <span>${this.escapeHtml(item.name)}</span>
                                            <span>${item.quantity} x LKR ${item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="print-order">
                                <i class="fas fa-print me-1"></i>Print Receipt
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal
        $('#orderSuccessModal').remove();

        // Add new modal to body
        $('body').append(modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
        modal.show();

        // Bind print button
        $('#print-order').on('click', () => {
            window.print();
        });
    }
}