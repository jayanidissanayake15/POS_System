class CustomerDTO {
    constructor(id, name, phone, address = '') {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    validate() {
        const errors = [];
        if (!this.name || this.name.trim().length === 0) {
            errors.push('Customer name is required');
        }
        if (!this.phone || !this.isValidPhone(this.phone)) {
            errors.push('Valid phone number is required');
        }
        return errors;
    }

    isValidPhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone.replace(/-/g, ''));
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            address: this.address,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromJSON(data) {
        return new CustomerDTO(
            data.id,
            data.name,
            data.phone,
            data.address
        );
    }
}