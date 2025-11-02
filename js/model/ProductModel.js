class ProductModel {
    constructor(db) {
        this.db = db;
        console.log('ProductModel initialized with DB:', db);
    }

    getAllProducts() {
        try {
            const products = this.db.getProducts();
            console.log('Retrieved products from DB:', products.length);
            return products.map(product => ProductDTO.fromJSON(product));
        } catch (error) {
            console.error('Error getting products:', error);
            throw new Error('Failed to retrieve products');
        }
    }

    getProductById(id) {
        try {
            const product = this.db.getById('products', id);
            return product ? ProductDTO.fromJSON(product) : null;
        } catch (error) {
            console.error('Error getting product by ID:', error);
            throw new Error('Failed to retrieve product');
        }
    }

    getProductByCode(code) {
        try {
            const products = this.getAllProducts();
            return products.find(product => product.code === code);
        } catch (error) {
            console.error('Error getting product by code:', error);
            throw new Error('Failed to retrieve product by code');
        }
    }

    createProduct(productData) {
        try {
            console.log('Creating product with data:', productData);
            const id = this.db.generateId();
            const productDTO = new ProductDTO(id, productData.code, productData.name, productData.price, productData.quantity);
            const errors = productDTO.validate();

            if (errors.length > 0) {
                throw new Error(errors.join(', '));
            }

            // Check for duplicate product code
            const existingProduct = this.getProductByCode(productData.code);
            if (existingProduct) {
                throw new Error('Product with this code already exists');
            }

            const createdProduct = this.db.create('products', productDTO.toJSON());
            console.log('Product created successfully:', createdProduct);
            return ProductDTO.fromJSON(createdProduct);
        } catch (error) {
            console.error('Error creating product:', error);
            throw new Error('Failed to create product: ' + error.message);
        }
    }

    updateProduct(id, productData) {
        try {
            console.log('Updating product ID:', id, 'with data:', productData);
            const productDTO = new ProductDTO(id, productData.code, productData.name, productData.price, productData.quantity);
            const errors = productDTO.validate();

            if (errors.length > 0) {
                throw new Error(errors.join(', '));
            }

            // Check for duplicate product code (excluding current product)
            const existingProduct = this.getAllProducts().find(p =>
                p.id !== id && p.code === productData.code
            );

            if (existingProduct) {
                throw new Error('Another product with this code already exists');
            }

            const updatedProduct = this.db.update('products', id, productDTO.toJSON());
            console.log('Product updated successfully:', updatedProduct);
            return updatedProduct ? ProductDTO.fromJSON(updatedProduct) : null;
        } catch (error) {
            console.error('Error updating product:', error);
            throw new Error('Failed to update product: ' + error.message);
        }
    }

    deleteProduct(id) {
        try {
            console.log('Deleting product ID:', id);
            const success = this.db.delete('products', id);
            console.log('Product deletion result:', success);
            return success;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw new Error('Failed to delete product');
        }
    }

    updateStock(productId, quantityChange) {
        try {
            console.log('Updating stock for product ID:', productId, 'change:', quantityChange);
            const product = this.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            const newQuantity = product.quantity + quantityChange;
            if (newQuantity < 0) {
                throw new Error('Insufficient stock');
            }

            product.updateQuantity(quantityChange);
            const updatedProduct = this.updateProduct(productId, product);
            console.log('Stock updated successfully:', updatedProduct);
            return updatedProduct;
        } catch (error) {
            console.error('Error updating stock:', error);
            throw new Error('Failed to update stock: ' + error.message);
        }
    }

    getLowStockProducts(threshold = 10) {
        try {
            const products = this.getAllProducts();
            return products.filter(product => product.quantity <= threshold);
        } catch (error) {
            console.error('Error getting low stock products:', error);
            throw new Error('Failed to get low stock products');
        }
    }

    searchProducts(query) {
        try {
            const products = this.getAllProducts();
            return products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.code.toLowerCase().includes(query.toLowerCase()) ||
                product.price.toString().includes(query)
            );
        } catch (error) {
            console.error('Error searching products:', error);
            throw new Error('Failed to search products');
        }
    }

    getProductsByCategory(category) {
        try {
            const products = this.getAllProducts();
            return products.filter(product =>
                product.category && product.category.toLowerCase() === category.toLowerCase()
            );
        } catch (error) {
            console.error('Error getting products by category:', error);
            throw new Error('Failed to get products by category');
        }
    }
}