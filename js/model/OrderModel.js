class OrderModel {
    constructor(db) {
        this.db = db;
    }

    getAllOrders() {
        return this.db.getOrders().map(order => OrderDTO.fromJSON(order));
    }

    getOrderById(id) {
        const order = this.db.getById('orders', id);
        return order ? OrderDTO.fromJSON(order) : null;
    }

    createOrder(orderData, productModel) {
        const id = this.db.generateId();
        const orderDTO = new OrderDTO(id, orderData.customerId, orderData.customerName, orderData.items, orderData.total);
        const errors = orderDTO.validate();

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        // Update product quantities
        for (const item of orderData.items) {
            try {
                productModel.updateStock(item.id, -item.quantity);
            } catch (error) {
                throw new Error(`Failed to update stock for ${item.name}: ${error.message}`);
            }
        }

        const createdOrder = this.db.create('orders', orderDTO.toJSON());
        return OrderDTO.fromJSON(createdOrder);
    }

    getOrdersByCustomer(customerId) {
        const orders = this.getAllOrders();
        return orders.filter(order => order.customerId === customerId);
    }

    getOrdersByDateRange(startDate, endDate) {
        const orders = this.getAllOrders();
        return orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= startDate && orderDate <= endDate;
        });
    }

    getTotalRevenue() {
        const orders = this.getAllOrders();
        return orders.reduce((total, order) => total + order.total, 0);
    }

    getRecentOrders(limit = 10) {
        const orders = this.getAllOrders();
        return orders
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }
}