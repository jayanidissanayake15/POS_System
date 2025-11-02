class ProductController {
    constructor(productModel, productView) {
        this.productModel = productModel;
        this.productView = productView;

        this.init();
    }

    init() {
        this.productView.bindAddProduct(this.handleAddProduct.bind(this));
        this.productView.bindSaveProduct(this.handleSaveProduct.bind(this));
        this.productView.bindEditProduct(this.handleEditProduct.bind(this));
        this.productView.bindDeleteProduct(this.handleDeleteProduct.bind(this));
        this.productView.bindCancelProduct(this.handleCancelProduct.bind(this));
    }

    showProducts() {
        try {
            const products = this.productModel.getAllProducts();
            this.productView.renderProducts(products);
            this.productView.show();
        } catch (error) {
            this.productView.showAlert('Error loading products: ' + error.message, 'error');
        }
    }

    handleAddProduct() {
        this.productView.showProductForm();
    }

    handleSaveProduct(productData) {
        try {
            if (productData.id) {
                // Update existing product
                const updatedProduct = this.productModel.updateProduct(productData.id, productData);
                if (updatedProduct) {
                    this.productView.showAlert('Product updated successfully');
                    this.showProducts();
                    this.productView.hideProductForm();
                }
            } else {
                // Create new product
                const newProduct = this.productModel.createProduct(productData);
                this.productView.showAlert('Product created successfully');
                this.showProducts();
                this.productView.hideProductForm();
            }
        } catch (error) {
            this.productView.showAlert('Error saving product: ' + error.message, 'error');
        }
    }

    handleEditProduct(id) {
        try {
            const product = this.productModel.getProductById(id);
            if (product) {
                this.productView.showProductForm(product);
            }
        } catch (error) {
            this.productView.showAlert('Error loading product: ' + error.message, 'error');
        }
    }

    handleDeleteProduct(id) {
        try {
            const success = this.productModel.deleteProduct(id);
            if (success) {
                this.productView.showAlert('Product deleted successfully');
                this.showProducts();
            }
        } catch (error) {
            this.productView.showAlert('Error deleting product: ' + error.message, 'error');
        }
    }

    handleCancelProduct() {
        this.productView.hideProductForm();
    }

    getAllProducts() {
        return this.productModel.getAllProducts();
    }

    getAvailableProducts() {
        const products = this.productModel.getAllProducts();
        return products.filter(product => product.quantity > 0);
    }

    getProductById(id) {
        return this.productModel.getProductById(id);
    }

    updateProductStock(productId, quantityChange) {
        return this.productModel.updateStock(productId, quantityChange);
    }
}