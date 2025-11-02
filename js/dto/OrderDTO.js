class OrderDTO {
    constructor(id, customerId, customerName, items, total) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.items = items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
        }));
        this.total = parseFloat(total);
        this.date = new Date();
        this.status = 'completed';
    }

    validate() {
        const errors = [];
        if (!this.customerId) {
            errors.push('Customer is required');
        }
        if (!this.items || this.items.length === 0) {
            errors.push('At least one item is required');
        }
        if (this.total <= 0) {
            errors.push('Valid total amount is required');
        }
        return errors;
    }

    toJSON() {
        return {
            id: this.id,
            customerId: this.customerId,
            customerName: this.customerName,
            items: this.items,
            total: this.total,
            date: this.date,
            status: this.status
        };
    }

    static fromJSON(data) {
        return new OrderDTO(
            data.id,
            data.customerId,
            data.customerName,
            data.items,
            data.total
        );
    }
}