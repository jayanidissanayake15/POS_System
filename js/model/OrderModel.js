class OrderModel {
    constructor(db) {
        this.db = db;
        console.log('OrderModel initialized with DB:', db);
    }

    getAllOrders() {
        try {
            const orders = this.db.getOrders();
            console.log('Retrieved orders from DB:', orders.length);
            return orders.map(order => OrderDTO.fromJSON(order));
        } catch (error) {
            console.error('Error getting orders:', error);
            throw new Error('Failed to retrieve orders');
        }
    }

    getOrderById(id) {
        try {
            const order = this.db.getById('orders', id);
            return order ? OrderDTO.fromJSON(order) : null;
        } catch (error) {
            console.error('Error getting order by ID:', error);
            throw new Error('Failed to retrieve order');
        }
    }

    createOrder(orderData, productModel) {
        try {
            console.log('Creating order with data:', orderData);
            const id = this.db.generateId();
            const orderDTO = new OrderDTO(id, orderData.customerId, orderData.customerName, orderData.items, orderData.total);
            const errors = orderDTO.validate();

            if (errors.length > 0) {
                throw new Error(errors.join(', '));
            }

            // Update product quantities and validate stock
            for (const item of orderData.items) {
                const product = productModel.getProductById(item.id);
                if (!product) {
                    throw new Error(`Product "${item.name}" not found`);
                }
                if (product.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for "${item.name}". Available: ${product.quantity}, Requested: ${item.quantity}`);
                }
            }

            // Update stock quantities
            for (const item of orderData.items) {
                try {
                    productModel.updateStock(item.id, -item.quantity);
                } catch (error) {
                    throw new Error(`Failed to update stock for ${item.name}: ${error.message}`);
                }
            }

            const createdOrder = this.db.create('orders', orderDTO.toJSON());
            console.log('Order created successfully:', createdOrder);
            return OrderDTO.fromJSON(createdOrder);
        } catch (error) {
            console.error('Error creating order:', error);
            throw new Error('Failed to create order: ' + error.message);
        }
    }

    getOrdersByCustomer(customerId) {
        try {
            const orders = this.getAllOrders();
            return orders.filter(order => order.customerId === customerId);
        } catch (error) {
            console.error('Error getting orders by customer:', error);
            throw new Error('Failed to retrieve orders by customer');
        }
    }

    getOrdersByDateRange(startDate, endDate) {
        try {
            const orders = this.getAllOrders();
            return orders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate >= startDate && orderDate <= endDate;
            });
        } catch (error) {
            console.error('Error getting orders by date range:', error);
            throw new Error('Failed to retrieve orders by date range');
        }
    }

    getTotalRevenue() {
        try {
            const orders = this.getAllOrders();
            return orders.reduce((total, order) => total + order.total, 0);
        } catch (error) {
            console.error('Error calculating total revenue:', error);
            throw new Error('Failed to calculate total revenue');
        }
    }

    getRecentOrders(limit = 10) {
        try {
            const orders = this.getAllOrders();
            return orders
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, limit);
        } catch (error) {
            console.error('Error getting recent orders:', error);
            throw new Error('Failed to retrieve recent orders');
        }
    }

    getDailySales() {
        try {
            const orders = this.getAllOrders();
            const salesByDate = {};

            orders.forEach(order => {
                const date = new Date(order.date).toLocaleDateString();
                if (!salesByDate[date]) {
                    salesByDate[date] = 0;
                }
                salesByDate[date] += order.total;
            });

            return salesByDate;
        } catch (error) {
            console.error('Error calculating daily sales:', error);
            throw new Error('Failed to calculate daily sales');
        }
    }
}