class OrderController {
    constructor(orderModel, orderView, customerController, productController) {
        this.orderModel = orderModel;
        this.orderView = orderView;
        this.customerController = customerController;
        this.productController = productController;

        this.init();
    }

    init() {
        this.orderView.bindAddItemToOrder(this.handleAddItemToOrder.bind(this));
        this.orderView.bindQuantityChange(this.handleQuantityChange.bind(this));
        this.orderView.bindRemoveItem(this.handleRemoveItem.bind(this));
        this.orderView.bindPlaceOrder(this.handlePlaceOrder.bind(this));
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
                this.orderView.updateOrderItemTotal(itemElement, item.price);
                this.orderView.updateOrderTotal();
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
        this.orderView.updateOrderTotal();
    }

    handlePlaceOrder() {
        try {
            const orderData = this.orderView.getOrderData();

            // Validate order
            if (!orderData.customerId) {
                this.orderView.showAlert('Please select a customer', 'error');
                return;
            }

            if (orderData.items.length === 0) {
                this.orderView.showAlert('Please add at least one item to the order', 'error');
                return;
            }

            // Get customer name
            const customer = this.customerController.getCustomerById(parseInt(orderData.customerId));
            if (!customer) {
                this.orderView.showAlert('Selected customer not found', 'error');
                return;
            }

            // Create order
            const order = {
                customerId: parseInt(orderData.customerId),
                customerName: customer.name,
                items: orderData.items,
                total: orderData.total
            };

            const createdOrder = this.orderModel.createOrder(order, this.productController);

            this.orderView.showAlert('Order placed successfully! Order ID: ' + createdOrder.id);
            this.orderView.clearOrderForm();

            // Refresh available products
            const availableProducts = this.productController.getAvailableProducts();
            this.orderView.renderAvailableProducts(availableProducts);

        } catch (error) {
            this.orderView.showAlert('Error placing order: ' + error.message, 'error');
        }
    }

    getAllOrders() {
        return this.orderModel.getAllOrders();
    }
}