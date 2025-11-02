class LocalStorageDB {
    constructor() {
        this.storageKey = 'ceylon_pos_data';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                users: [
                    { username: 'admin', password: 'password', role: 'admin', createdAt: new Date() }
                ],
                customers: [],
                products: [],
                orders: [],
                settings: {
                    currency: 'LKR',
                    taxRate: 0,
                    companyName: 'Ceylon POS'
                }
            };
            this.saveAll(initialData);
        }
    }

    // Generic CRUD operations
    getAll(key) {
        const data = this.loadAll();
        return data[key] || [];
    }

    getById(key, id) {
        const items = this.getAll(key);
        return items.find(item => item.id === id);
    }

    create(key, item) {
        const items = this.getAll(key);
        items.push(item);
        this.updateKey(key, items);
        return item;
    }

    update(key, id, updatedItem) {
        const items = this.getAll(key);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updatedItem, updatedAt: new Date() };
            this.updateKey(key, items);
            return items[index];
        }
        return null;
    }

    delete(key, id) {
        const items = this.getAll(key);
        const filteredItems = items.filter(item => item.id !== id);
        this.updateKey(key, filteredItems);
        return filteredItems.length !== items.length;
    }

    // Specific entity methods
    getCustomers() {
        return this.getAll('customers');
    }

    getProducts() {
        return this.getAll('products');
    }

    getOrders() {
        return this.getAll('orders');
    }

    getUsers() {
        return this.getAll('users');
    }

    // Helper methods
    loadAll() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    saveAll(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    updateKey(key, value) {
        const data = this.loadAll();
        data[key] = value;
        this.saveAll(data);
    }

    clear() {
        localStorage.removeItem(this.storageKey);
        this.init();
    }

    // ID generation
    generateId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }
}