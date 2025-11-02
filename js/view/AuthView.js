class AuthView {
    constructor() {
        this.loginSection = $('#login-section');
        this.mainApp = $('#main-app');
        this.loginForm = $('#login-form');
        this.loginError = $('#login-error');
    }

    showLogin() {
        this.loginSection.removeClass('hidden');
        this.mainApp.addClass('hidden');
        this.loginForm[0].reset();
        this.hideError();
    }

    showMainApp() {
        this.loginSection.addClass('hidden');
        this.mainApp.removeClass('hidden');
    }

    showError(message) {
        this.loginError.text(message).removeClass('hidden');
    }

    hideError() {
        this.loginError.addClass('hidden');
    }

    bindLogin(handler) {
        this.loginForm.on('submit', (e) => {
            e.preventDefault();
            const username = $('#username').val();
            const password = $('#password').val();
            handler(username, password);
        });
    }

    bindLogout(handler) {
        $('#logout-btn').on('click', handler);
    }
}