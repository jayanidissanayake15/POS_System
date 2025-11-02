class UserModel {
    constructor(db) {
        this.db = db;
        this.currentUser = null;
    }

    authenticate(username, password) {
        const users = this.db.getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    createUser(userData) {
        const userDTO = new UserDTO(userData.username, userData.password, userData.role);
        const errors = userDTO.validate();

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const existingUser = this.db.getUsers().find(u => u.username === userData.username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        return this.db.create('users', userDTO.toJSON());
    }
}