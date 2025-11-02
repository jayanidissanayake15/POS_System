class ProductDTO {
    constructor(id, code, name, price, quantity) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.price = parseFloat(price);
        this.quantity = parseInt(quantity);
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    validate() {
        const errors = [];
        if (!this.code || this.code.trim().length === 0) {
            errors.push('Product code is required');
        }
        if (!this.name || this.name.trim().length === 0) {
            errors.push('Product name is required');
        }
        if (this.price < 0 || isNaN(this.price)) {
            errors.push('Valid price is required');
        }
        if (this.quantity < 0 || isNaN(this.quantity)) {
            errors.push('Valid quantity is required');
        }
        return errors;
    }

    updateQuantity(amount) {
        this.quantity += amount;
        this.updatedAt = new Date();
    }

    toJSON() {
        return {
            id: this.id,
            code: this.code,
            name: this.name,
            price: this.price,
            quantity: this.quantity,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromJSON(data) {
        return new ProductDTO(
            data.id,
            data.code,
            data.name,
            data.price,
            data.quantity
        );
    }
}