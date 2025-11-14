import { user_array } from '../model/db.js';
import UserModel from '../model/userModel.js';

export default class UserController {
    constructor() {
        this.currentUser = null;
        this.initializeEventListeners();
        this.checkExistingSession();
    }

    initializeEventListeners() {
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });

        document.getElementById('showRegister').addEventListener('click', () => {
            this.showRegisterForm();
        });

        document.getElementById('showLogin').addEventListener('click', () => {
            this.showLoginForm();
        });

        document.getElementById('logout_nav').addEventListener('click', () => {
            this.handleLogout();
        });
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showAlert('Error', 'Please fill in all fields', 'error');
            return;
        }

        const user = user_array.find(u => u.Email === email && u.Password === password);
        
        if (user) {
            this.currentUser = user;
            this.createSession(user);
            this.showApp();
            this.showAlert('Success', 'Login successful!', 'success');
        } else {
            this.showAlert('Error', 'Invalid email or password', 'error');
        }
    }

    handleRegistration() {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!username || !email || !password || !confirmPassword) {
            this.showAlert('Error', 'Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showAlert('Error', 'Passwords do not match', 'error');
            return;
        }

        const existingUser = user_array.find(u => u.Email === email);
        if (existingUser) {
            this.showAlert('Error', 'User with this email already exists', 'error');
            return;
        }

        const userId = this.generateUserId();
        const newUser = new UserModel(userId, username, email, password);
        user_array.push(newUser);

        this.showAlert('Success', 'Registration successful! Please login.', 'success');
        this.showLoginForm();
    }

    handleLogout() {
        this.currentUser = null;
        this.clearSession();
        this.showAuth();
        this.showAlert('Success', 'Logged out successfully', 'success');
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('loginFormElement').reset();
    }

    showRegisterForm() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('registerFormElement').reset();
    }

    showAuth() {
        document.getElementById('AuthSection').classList.remove('hidden');
        document.getElementById('AppSection').classList.add('hidden');
        this.showLoginForm();
    }

    showApp() {
        document.getElementById('AuthSection').classList.add('hidden');
        document.getElementById('AppSection').classList.remove('hidden');
        
        this.initializeAppNavigation();
    }

    initializeAppNavigation() {
        document.getElementById("HomeSection").style.display = "flex";
        document.getElementById("CustomerSection").style.display = "none";
        document.getElementById("ItemSection").style.display = "none";
        document.getElementById("OrderSection").style.display = "none";
        document.getElementById("OrderDetailsSection").style.display = "none";

        document.getElementById("home_nav").addEventListener("click",function (){
            document.getElementById("HomeSection").style.display = "flex";
            document.getElementById("CustomerSection").style.display = "none";
            document.getElementById("ItemSection").style.display = "none";
            document.getElementById("OrderSection").style.display = "none";
            document.getElementById("OrderDetailsSection").style.display = "none";
        });
        document.getElementById("customer_nav").addEventListener("click",function (){
            document.getElementById("HomeSection").style.display = "none";
            document.getElementById("CustomerSection").style.display = "block";
            document.getElementById("ItemSection").style.display = "none";
            document.getElementById("OrderSection").style.display = "none";
            document.getElementById("OrderDetailsSection").style.display = "none";
        });
        document.getElementById("item_nav").addEventListener("click",function (){
            document.getElementById("HomeSection").style.display = "none";
            document.getElementById("CustomerSection").style.display = "none";
            document.getElementById("ItemSection").style.display = "block";
            document.getElementById("OrderSection").style.display = "none";
            document.getElementById("OrderDetailsSection").style.display = "none";
        });
        document.getElementById("order_nav").addEventListener("click",function (){
            document.getElementById("HomeSection").style.display = "none";
            document.getElementById("CustomerSection").style.display = "none";
            document.getElementById("ItemSection").style.display = "none";
            document.getElementById("OrderSection").style.display = "block";
            document.getElementById("OrderDetailsSection").style.display = "none";
        });
        document.getElementById("orderDetails_nav").addEventListener("click",function (){
            document.getElementById("HomeSection").style.display = "none";
            document.getElementById("CustomerSection").style.display = "none";
            document.getElementById("ItemSection").style.display = "none";
            document.getElementById("OrderSection").style.display = "none";
            document.getElementById("OrderDetailsSection").style.display = "block";
        });
    }

    createSession(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    clearSession() {
        localStorage.removeItem('currentUser');
    }

    checkExistingSession() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            this.showApp();
        } else {
            this.showAuth();
        }
    }

    generateUserId() {
        return 'user_' + Date.now();
    }

    showAlert(title, text, icon) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'OK'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UserController();
});