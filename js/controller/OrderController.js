class OrderController {
    constructor(orderModel, orderView, customerController, productController) {
        this.orderModel = orderModel;
        this.orderView = orderView;
        this.customerController = customerController;
        this.productController = productController;
        this.currentOrders = [];

        this.init();
    }

    init() {
        this.orderView.bindAddItemToOrder(this.handleAddItemToOrder.bind(this));
        this.orderView.bindQuantityChange(this.handleQuantityChange.bind(this));
        this.orderView.bindRemoveItem(this.handleRemoveItem.bind(this));
        this.orderView.bindPlaceOrder(this.handlePlaceOrder.bind(this));
        this.orderView.bindClearOrder(this.handleClearOrder.bind(this));
        this.orderView.bindAddSampleItems(this.handleAddSampleItems.bind(this));
        this.orderView.bindCustomerSelect(this.handleCustomerSelect.bind(this));

        this.orderView.bindRefreshOrders(this.handleRefreshOrders.bind(this));
        this.orderView.bindOrderFilters(this.handleOrderFilters.bind(this));
        this.orderView.bindClearOrderFilters(this.handleClearOrderFilters.bind(this));
        this.orderView.bindViewOrder(this.handleViewOrder.bind(this));
    }

    showOrderForm() {
        try {
            const customers = this.customerController.getAllCustomers();
            const availableProducts = this.productController.getAvailableProducts();

            this.orderView.renderCustomers(customers);
            this.orderView.renderAvailableProducts(availableProducts);
            this.orderView.clearOrderForm();
            this.orderView.show();
        } catch (error) {
            this.orderView.showAlert('Error loading order form: ' + error.message, 'error');
        }
    }

    showOrderHistory() {
        try {
            this.currentOrders = this.orderModel.getAllOrders();
            this.orderView.renderOrderHistory(this.currentOrders);
            this.orderView.showOrderHistory();
        } catch (error) {
            this.orderView.showAlert('Error loading order history: ' + error.message, 'error');
        }
    }

    handleAddItemToOrder(itemId) {
        try {
            const product = this.productController.getProductById(itemId);
            if (product) {
                this.orderView.addItemToOrder(product);
            }
        } catch (error) {
            this.orderView.showAlert('Error adding item: ' + error.message, 'error');
        }
    }

    handleQuantityChange(quantityInput) {
        const itemElement = quantityInput.closest('.order-item');
        const id = parseInt(itemElement.data('id'));

        try {
            const item = this.productController.getProductById(id);
            const quantity = parseInt(quantityInput.val());

            if (item && quantity <= item.quantity) {
                this.orderView.updateItemTotal(itemElement, item.price);
                this.orderView.updateOrderSummary();
            } else {
                quantityInput.val(item.quantity);
                this.orderView.showAlert(`Only ${item.quantity} units of ${item.name} available`, 'warning');
            }
        } catch (error) {
            this.orderView.showAlert('Error updating quantity: ' + error.message, 'error');
        }
    }

    handleRemoveItem(removeButton) {
        removeButton.closest('.order-item').remove();
        this.orderView.updateOrderSummary();
        this.orderView.updateItemsCount();
        this.orderView.updatePlaceOrderButton();

        if ($('.order-item').length === 0) {
            this.orderView.clearOrderForm();
        }
    }

    handlePlaceOrder() {
        try {
            const orderData = this.orderView.getOrderData();

            if (!orderData.customerId) {
                this.orderView.showAlert('Please select a customer', 'error');
                return;
            }

            if (orderData.items.length === 0) {
                this.orderView.showAlert('Please add at least one item to the order', 'error');
                return;
            }

            const customer = this.customerController.getCustomerById(parseInt(orderData.customerId));
            if (!customer) {
                this.orderView.showAlert('Selected customer not found', 'error');
                return;
            }

            const order = {
                customerId: parseInt(orderData.customerId),
                customerName: customer.name,
                items: orderData.items,
                total: orderData.total
            };

            const createdOrder = this.orderModel.createOrder(order, this.productController);

            this.orderView.showOrderSuccess(createdOrder);
            this.orderView.clearOrderForm();

            const availableProducts = this.productController.getAvailableProducts();
            this.orderView.renderAvailableProducts(availableProducts);

            if (this.onOrderUpdate) {
                this.onOrderUpdate();
            }

        } catch (error) {
            this.orderView.showAlert('Error placing order: ' + error.message, 'error');
        }
    }

    handleClearOrder() {
        if (confirm('Are you sure you want to clear the current order?')) {
            this.orderView.clearOrderForm();
        }
    }

    handleAddSampleItems() {
        try {
            const availableProducts = this.productController.getAvailableProducts();
            if (availableProducts.length === 0) {
                this.orderView.showAlert('No products available to add', 'warning');
                return;
            }

            const sampleProducts = availableProducts.slice(0, 3);
            sampleProducts.forEach(product => {
                this.orderView.addItemToOrder(product);
            });

            this.orderView.showAlert(`Added ${sampleProducts.length} sample items to order`);
        } catch (error) {
            this.orderView.showAlert('Error adding sample items: ' + error.message, 'error');
        }
    }

    handleCustomerSelect(customerId) {
        try {
            const customer = this.customerController.getCustomerById(parseInt(customerId));
            this.orderView.showCustomerDetails(customer);
        } catch (error) {
            console.error('Error loading customer details:', error);
        }
    }

    handleRefreshOrders() {
        this.showOrderHistory();
        this.orderView.showAlert('Order history refreshed');
    }

    handleOrderFilters() {
        try {
            const dateFilter = $('#date-filter').val();
            const customerFilter = $('#customer-filter').val();
            const statusFilter = $('#status-filter').val();

            let filteredOrders = this.currentOrders;

            if (dateFilter !== 'all') {
                const now = new Date();
                filteredOrders = filteredOrders.filter(order => {
                    const orderDate = new Date(order.date);
                    switch (dateFilter) {
                        case 'today':
                            return orderDate.toDateString() === now.toDateString();
                        case 'week':
                            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                            return orderDate >= weekAgo;
                        case 'month':
                            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                            return orderDate >= monthAgo;
                        default:
                            return true;
                    }
                });
            }

            if (customerFilter !== 'all') {
                filteredOrders = filteredOrders.filter(order => order.customerId === parseInt(customerFilter));
            }

            if (statusFilter !== 'all') {
                filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
            }

            this.orderView.renderOrderHistory(filteredOrders);
        } catch (error) {
            this.orderView.showAlert('Error filtering orders: ' + error.message, 'error');
        }
    }

    handleClearOrderFilters() {
        $('#date-filter').val('all');
        $('#customer-filter').val('all');
        $('#status-filter').val('all');
        this.showOrderHistory();
    }

    handleViewOrder(orderId) {
        try {
            const order = this.orderModel.getOrderById(orderId);
            if (order) {
                this.showOrderDetails(order);
            } else {
                this.orderView.showAlert('Order not found', 'error');
            }
        } catch (error) {
            this.orderView.showAlert('Error loading order details: ' + error.message, 'error');
        }
    }

    showOrderDetails(order) {
        const modalHtml = `
            <div class="modal fade" id="orderDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Order Details - #${order.id}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <h6>Customer Information</h6>
                                    <table class="table table-sm">
                                        <tr>
                                            <td><strong>Name:</strong></td>
                                            <td>${order.customerName}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Order Date:</strong></td>
                                            <td>${new Date(order.date).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Status:</strong></td>
                                            <td><span class="badge ${this.orderView.getOrderStatusClass(order.status)}">${order.status}</span></td>
                                        </tr>
                                    </table>
                                </div>
                            </div>

                            <h6>Order Items</h6>
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${order.items.map(item => `
                                        <tr>
                                            <td>${item.name}</td>
                                            <td>LKR ${item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                            <td>${item.quantity}</td>
                                            <td>LKR ${(item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="3" class="text-end"><strong>Total:</strong></td>
                                        <td><strong>LKR ${order.total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('#orderDetailsModal').remove();
        $('body').append(modalHtml);

        const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
        modal.show();
    }

    getAllOrders() {
        return this.orderModel.getAllOrders();
    }

    getOrdersCount() {
        return this.orderModel.getAllOrders().length;
    }

    getTotalRevenue() {
        return this.orderModel.getTotalRevenue();
    }

    setOnOrderUpdate(callback) {
        this.onOrderUpdate = callback;
    }
}