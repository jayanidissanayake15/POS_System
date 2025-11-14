export default class UserModel {
    constructor(userId, userName, Email, Password, Role = "user") {
        this._userId = userId;
        this._userName = userName;
        this._Email = Email;
        this._Password = Password;
        this._Role = Role;
    }

    get userId() {
        return this._userId;
    }

    set userId(value) {
        this._userId = value;
    }

    get userName() {
        return this._userName;
    }

    set userName(value) {
        this._userName = value;
    }

    get Email() {
        return this._Email;
    }

    set Email(value) {
        this._Email = value;
    }

    get Password() {
        return this._Password;
    }

    set Password(value) {
        this._Password = value;
    }

    get Role() {
        return this._Role;
    }

    set Role(value) {
        this._Role = value;
    }
}