class ProductController {
    constructor(productModel, productView) {
        this.productModel = productModel;
        this.productView = productView;
        this.currentProducts = [];

        this.init();
    }

    init() {
        this.productView.bindAddProduct(this.handleAddProduct.bind(this));
        this.productView.bindSaveProduct(this.handleSaveProduct.bind(this));
        this.productView.bindEditProduct(this.handleEditProduct.bind(this));
        this.productView.bindViewProduct(this.handleViewProduct.bind(this));
        this.productView.bindDeleteProduct(this.handleDeleteProduct.bind(this));
        this.productView.bindCancelProduct(this.handleCancelProduct.bind(this));
        this.productView.bindSearch(this.handleSearch.bind(this));
        this.productView.bindFilter(this.handleFilter.bind(this));
        this.productView.bindClearFilters(this.handleClearFilters.bind(this));

        console.log('ProductController initialized');
    }

    showProducts() {
        try {
            this.productView.showLoading();
            this.currentProducts = this.productModel.getAllProducts();
            this.productView.renderProducts(this.currentProducts);
            this.productView.show();

            console.log(`Loaded ${this.currentProducts.length} products`);
        } catch (error) {
            console.error('Error loading products:', error);
            this.productView.showAlert('Error loading products: ' + error.message, 'error');
        }
    }

    handleAddProduct() {
        console.log('Add product clicked');
        this.productView.showProductForm();
    }

    handleSaveProduct(productData) {
        try {
            console.log('Saving product:', productData);

            if (productData.id) {
                // Update existing product
                const updatedProduct = this.productModel.updateProduct(productData.id, productData);
                if (updatedProduct) {
                    this.productView.showAlert('Product updated successfully');
                    this.showProducts();
                    this.productView.hideProductForm();
                } else {
                    this.productView.showAlert('Product not found', 'error');
                }
            } else {
                // Create new product
                const newProduct = this.productModel.createProduct(productData);
                this.productView.showAlert('Product created successfully');
                this.showProducts();
                this.productView.hideProductForm();

                // Notify dashboard to refresh stats
                if (this.onProductUpdate) {
                    this.onProductUpdate();
                }
            }
        } catch (error) {
            console.error('Error saving product:', error);
            this.productView.showAlert('Error saving product: ' + error.message, 'error');
        }
    }

    handleEditProduct(id) {
        try {
            console.log('Editing product ID:', id);
            const product = this.productModel.getProductById(id);
            if (product) {
                this.productView.showProductForm(product);
            } else {
                this.productView.showAlert('Product not found', 'error');
            }
        } catch (error) {
            console.error('Error loading product:', error);
            this.productView.showAlert('Error loading product: ' + error.message, 'error');
        }
    }

    handleViewProduct(id) {
        try {
            console.log('Viewing product ID:', id);
            const product = this.productModel.getProductById(id);
            if (product) {
                this.showProductDetails(product);
            } else {
                this.productView.showAlert('Product not found', 'error');
            }
        } catch (error) {
            console.error('Error loading product:', error);
            this.productView.showAlert('Error loading product: ' + error.message, 'error');
        }
    }

    handleDeleteProduct(id) {
        try {
            console.log('Deleting product ID:', id);
            const success = this.productModel.deleteProduct(id);
            if (success) {
                this.productView.showAlert('Product deleted successfully');
                this.showProducts();

                // Notify dashboard to refresh stats
                if (this.onProductUpdate) {
                    this.onProductUpdate();
                }
            } else {
                this.productView.showAlert('Product not found', 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            this.productView.showAlert('Error deleting product: ' + error.message, 'error');
        }
    }

    handleCancelProduct() {
        this.productView.hideProductForm();
    }

    handleSearch(query) {
        try {
            if (!query) {
                this.showProducts();
                return;
            }

            const filteredProducts = this.productModel.searchProducts(query);
            this.productView.renderProducts(filteredProducts);
        } catch (error) {
            console.error('Error searching products:', error);
            this.productView.showAlert('Error searching products: ' + error.message, 'error');
        }
    }

    handleFilter(filterType) {
        try {
            let filteredProducts = this.currentProducts;

            switch (filterType) {
                case 'in-stock':
                    filteredProducts = filteredProducts.filter(p => p.quantity > 10);
                    break;
                case 'low-stock':
                    filteredProducts = filteredProducts.filter(p => p.quantity > 0 && p.quantity <= 10);
                    break;
                case 'out-of-stock':
                    filteredProducts = filteredProducts.filter(p => p.quantity === 0);
                    break;
                case 'all':
                default:
                    // Show all products
                    break;
            }

            this.productView.renderProducts(filteredProducts);
        } catch (error) {
            console.error('Error filtering products:', error);
            this.productView.showAlert('Error filtering products: ' + error.message, 'error');
        }
    }

    handleClearFilters() {
        this.productView.clearSearchAndFilters();
        this.showProducts();
    }

    showProductDetails(product) {
        const stockStatus = this.productView.getStockStatus(product.quantity);
        const statusClass = this.productView.getStatusClass(stockStatus);

        const modalHtml = `
            <div class="modal fade" id="productDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Product Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6>Basic Information</h6>
                                    <table class="table table-sm">
                                        <tr>
                                            <td><strong>Code:</strong></td>
                                            <td>${product.code}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Name:</strong></td>
                                            <td>${product.name}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Price:</strong></td>
                                            <td>LKR ${product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="col-md-6">
                                    <h6>Inventory</h6>
                                    <table class="table table-sm">
                                        <tr>
                                            <td><strong>Quantity:</strong></td>
                                            <td>${product.quantity} units</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Status:</strong></td>
                                            <td><span class="badge ${statusClass}">${stockStatus}</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Created:</strong></td>
                                            <td>${new Date(product.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-warning" id="edit-from-details" data-id="${product.id}">
                                <i class="fas fa-edit me-1"></i>Edit Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal
        $('#productDetailsModal').remove();

        // Add new modal to body
        $('body').append(modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('productDetailsModal'));
        modal.show();

        // Bind edit button
        $('#edit-from-details').on('click', () => {
            modal.hide();
            this.handleEditProduct(product.id);
        });
    }

    // Public methods for other controllers
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

    getProductsCount() {
        return this.productModel.getAllProducts().length;
    }

    updateProductStock(productId, quantityChange) {
        return this.productModel.updateStock(productId, quantityChange);
    }

    getLowStockProducts() {
        return this.productModel.getLowStockProducts();
    }

    // Callback for dashboard updates
    setOnProductUpdate(callback) {
        this.onProductUpdate = callback;
    }
}