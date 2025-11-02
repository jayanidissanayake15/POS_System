class DashboardController {
    constructor(dashboardModel, dashboardView) {
        this.dashboardModel = dashboardModel;
        this.dashboardView = dashboardView;
    }

    showDashboard() {
        try {
            const stats = this.dashboardModel.getStats();
            const recentActivity = this.dashboardModel.getRecentActivity();
            const salesData = this.dashboardModel.getSalesData();

            this.dashboardView.renderStats(stats);
            this.dashboardView.renderRecentActivity(recentActivity);
            this.dashboardView.renderSalesData(salesData);
            this.dashboardView.show();
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }
}