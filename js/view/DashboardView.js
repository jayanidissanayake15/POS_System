class DashboardView {
    constructor() {
        this.section = $('#dashboard-section');
    }

    show() {
        this.section.removeClass('hidden');
    }

    hide() {
        this.section.addClass('hidden');
    }

    renderStats(stats) {
        $('#total-customers').text(stats.totalCustomers);
        $('#total-items').text(stats.totalProducts);
        $('#total-orders').text(stats.totalOrders);
        $('#total-revenue').text(`LKR ${stats.totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
    }

    renderRecentActivity(activity) {
        // Implementation for recent activity display
        console.log('Recent activity:', activity);
    }

    renderSalesData(salesData) {
        // Implementation for sales chart
        console.log('Sales data:', salesData);
    }
}