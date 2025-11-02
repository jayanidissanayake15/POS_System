class AuthController {
    constructor(userModel, authView) {
        this.userModel = userModel;
        this.authView = authView;

        this.init();
    }

    init() {
        this.authView.bindLogin(this.handleLogin.bind(this));
        this.authView.bindLogout(this.handleLogout.bind(this));
    }

    handleLogin(username, password) {
        try {
            if (this.userModel.authenticate(username, password)) {
                this.authView.showMainApp();
                // Notify other controllers about login
                if (this.onLogin) {
                    this.onLogin();
                }
            } else {
                this.authView.showError('Invalid username or password');
            }
        } catch (error) {
            this.authView.showError(error.message);
        }
    }

    handleLogout() {
        this.userModel.logout();
        this.authView.showLogin();
        // Notify other controllers about logout
        if (this.onLogout) {
            this.onLogout();
        }
    }

    setLoginCallback(callback) {
        this.onLogin = callback;
    }

    setLogoutCallback(callback) {
        this.onLogout = callback;
    }
}