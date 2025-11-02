class UserDTO {
    constructor(username, password, role = 'admin') {
        this.username = username;
        this.password = password;
        this.role = role;
        this.createdAt = new Date();
    }

    validate() {
        const errors = [];
        if (!this.username || this.username.length < 3) {
            errors.push('Username must be at least 3 characters long');
        }
        if (!this.password || this.password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }
        return errors;
    }

    toJSON() {
        return {
            username: this.username,
            role: this.role,
            createdAt: this.createdAt
        };
    }
}