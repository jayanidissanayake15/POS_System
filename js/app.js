class CeylonPOSApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('Initializing Ceylon POS System...');

        // Initialize database
        this.db = new LocalStorageDB();
        console.log('Database initialized');

        // Initialize models
        this.userModel = new UserModel(this.db);
        this.customerModel = new CustomerModel(this.db);
        this.productModel = new ProductModel(this.db);
        this.orderModel = new OrderModel(this.db);
        this.dashboardModel = new DashboardModel(this.customerModel, this.productModel, this.orderModel);

        console.log('Models initialized');

        // Initialize views
        this.authView = new AuthView();
        this.navigationView = new NavigationView();
        this.dashboardView = new DashboardView();
        this.customerView = new CustomerView();
        this.productView = new ProductView();
        this.orderView = new OrderView();

        console.log('Views initialized');

        // Initialize controllers
        this.authController = new AuthController(this.userModel, this.authView);
        this.dashboardController = new DashboardController(this.dashboardModel, this.dashboardView);
        this.customerController = new CustomerController(this.customerModel, this.customerView);
        this.productController = new ProductController(this.productModel, this.productView);
        this.orderController = new OrderController(
            this.orderModel,
            this.orderView,
            this.customerController,
            this.productController
        );

        console.log('Controllers initialized');

        // Set up navigation
        this.setupNavigation();

        // Set up authentication callbacks
        this.authController.setLoginCallback(this.onLogin.bind(this));
        this.authController.setLogoutCallback(this.onLogout.bind(this));

        // Set up customer update callback for dashboard
        this.customerController.setOnCustomerUpdate(this.refreshDashboard.bind(this));

        // Load sample data if empty
        this.loadSampleData();

        console.log('Ceylon POS System initialized successfully');
    }

    setupNavigation() {
        this.navigationView.bindNavigation((section) => {
            console.log('Navigation to section:', section);
            switch (section) {
                case 'dashboard':
                    this.dashboardController.showDashboard();
                    break;
                case 'customers':
                    this.customerController.showCustomers();
                    break;
                case 'items':
                    this.productController.showProducts();
                    break;
                case 'orders':
                    this.orderController.showOrderForm();
                    break;
                case 'order-history':
                    // Implement order history view
                    console.log('Order history section not yet implemented');
                    break;
            }
        });
    }

    onLogin() {
        console.log('User logged in, showing dashboard');
        this.dashboardController.showDashboard();
    }

    onLogout() {
        console.log('User logged out');
    }

    refreshDashboard() {
        console.log('Refreshing dashboard data');
        if (this.dashboardController) {
            this.dashboardController.showDashboard();
        }
    }

    loadSampleData() {
        // Load sample customers if empty
        if (this.customerModel.getAllCustomers().length === 0) {
            console.log('Loading sample customer data...');
            const sampleCustomers = [
                { name: 'Kamal Perera', phone: '0771234567', address: '123 Galle Road, Colombo 03' },
                { name: 'Nimali Fernando', phone: '0719876543', address: '456 Kandy Road, Kadawatha' },
                { name: 'Sunil Rathnayake', phone: '0765557890', address: '789 Negombo Road, Kurunegala' },
                { name: 'Chamari Silva', phone: '0702223333', address: '321 Matara Road, Galle' }
            ];

            sampleCustomers.forEach(customer => {
                try {
                    this.customerModel.createCustomer(customer);
                } catch (error) {
                    console.error('Error creating sample customer:', error);
                }
            });
            console.log('Sample customer data loaded');
        }
    }
}

// Initialize the application when DOM is ready
$(document).ready(function() {
    console.log('DOM ready, starting application...');
    window.app = new CeylonPOSApp();
});