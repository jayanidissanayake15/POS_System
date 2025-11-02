class DashboardModel {
    constructor(customerModel, productModel, orderModel) {
        this.customerModel = customerModel;
        this.productModel = productModel;
        this.orderModel = orderModel;
    }

    getStats() {
        const totalCustomers = this.customerModel.getAllCustomers().length;
        const totalProducts = this.productModel.getAllProducts().length;
        const totalOrders = this.orderModel.getAllOrders().length;
        const totalRevenue = this.orderModel.getTotalRevenue();
        const lowStockProducts = this.productModel.getLowStockProducts().length;

        return {
            totalCustomers,
            totalProducts,
            totalOrders,
            totalRevenue,
            lowStockProducts
        };
    }

    getRecentActivity() {
        const recentOrders = this.orderModel.getRecentOrders(5);
        const lowStockProducts = this.productModel.getLowStockProducts();

        return {
            recentOrders,
            lowStockProducts
        };
    }

    getSalesData(days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const orders = this.orderModel.getOrdersByDateRange(startDate, endDate);

        // Group by date
        const salesByDate = {};
        orders.forEach(order => {
            const date = new Date(order.date).toLocaleDateString();
            if (!salesByDate[date]) {
                salesByDate[date] = 0;
            }
            salesByDate[date] += order.total;
        });

        return {
            period: `${days} days`,
            totalSales: orders.reduce((sum, order) => sum + order.total, 0),
            averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
            salesByDate: salesByDate
        };
    }
}