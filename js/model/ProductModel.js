class ProductModel {
    constructor(db) {
        this.db = db;
    }

    getAllProducts() {
        return this.db.getProducts().map(product => ProductDTO.fromJSON(product));
    }

    getProductById(id) {
        const product = this.db.getById('products', id);
        return product ? ProductDTO.fromJSON(product) : null;
    }

    getProductByCode(code) {
        const products = this.getAllProducts();
        return products.find(product => product.code === code);
    }

    createProduct(productData) {
        const id = this.db.generateId();
        const productDTO = new ProductDTO(id, productData.code, productData.name, productData.price, productData.quantity);
        const errors = productDTO.validate();

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const existingProduct = this.getProductByCode(productData.code);
        if (existingProduct) {
            throw new Error('Product code already exists');
        }

        const createdProduct = this.db.create('products', productDTO.toJSON());
        return ProductDTO.fromJSON(createdProduct);
    }

    updateProduct(id, productData) {
        const productDTO = new ProductDTO(id, productData.code, productData.name, productData.price, productData.quantity);
        const errors = productDTO.validate();

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const updatedProduct = this.db.update('products', id, productDTO.toJSON());
        return updatedProduct ? ProductDTO.fromJSON(updatedProduct) : null;
    }

    deleteProduct(id) {
        return this.db.delete('products', id);
    }

    updateStock(productId, quantityChange) {
        const product = this.getProductById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        product.updateQuantity(quantityChange);
        return this.updateProduct(productId, product);
    }

    getLowStockProducts(threshold = 10) {
        const products = this.getAllProducts();
        return products.filter(product => product.quantity <= threshold);
    }

    searchProducts(query) {
        const products = this.getAllProducts();
        return products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.code.toLowerCase().includes(query.toLowerCase())
        );
    }
}