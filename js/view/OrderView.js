class OrderView {
    constructor() {
        this.section = $('#orders-section');
        this.orderItems = $('#order-items');
        this.availableItemsList = $('#available-items-list');
        this.customerSelect = $('#order-customer');
    }

    show() {
        this.section.removeClass('hidden');
    }

    hide() {
        this.section.addClass('hidden');
    }

    renderCustomers(customers) {
        this.customerSelect.empty();
        this.customerSelect.append('<option value="">Select a customer</option>');

        customers.forEach(customer => {
            this.customerSelect.append(`<option value="${customer.id}">${customer.name}</option>`);
        });
    }

    renderAvailableProducts(products) {
        this.availableItemsList.empty();

        if (products.length === 0) {
            this.availableItemsList.append('<div class="text-center">No products available</div>');
        } else {
            products.forEach(product => {
                if (product.quantity > 0) {
                    this.availableItemsList.append(`
                        <div class="list-group-item pointer available-item" data-id="${product.id}">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6 class="mb-1">${product.name}</h6>
                                    <small>${product.code} - LKR ${product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</small>
                                </div>
                                <span class="badge bg-primary rounded-pill">${product.quantity} available</span>
                            </div>
                        </div>
                    `);
                }
            });
        }
    }

    addItemToOrder(item) {
        const existingItem = $(`.order-item[data-id="${item.id}"]`);
        if (existingItem.length > 0) {
            const quantityInput = existingItem.find('.item-quantity');
            const currentQuantity = parseInt(quantityInput.val());
            if (currentQuantity < item.quantity) {
                quantityInput.val(currentQuantity + 1);
                this.updateOrderItemTotal(existingItem, item.price);
                this.updateOrderTotal();
            } else {
                alert(`Only ${item.quantity} units of ${item.name} available`);
            }
            return;
        }

        const orderItem = $(`
            <div class="order-item" data-id="${item.id}">
                <div class="row align-items-center">
                    <div class="col-md-4">
                        <h6>${item.name}</h6>
                        <small>${item.code} - LKR ${item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</small>
                    </div>
                    <div class="col-md-3">
                        <input type="number" class="form-control item-quantity" value="1" min="1" max="${item.quantity}">
                    </div>
                    <div class="col-md-3">
                        <span class="item-total">LKR ${item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-sm btn-danger remove-item">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `);

        this.orderItems.append(orderItem);
        this.updateOrderTotal();
    }

    updateOrderItemTotal(itemElement, price) {
        const quantity = parseInt(itemElement.find('.item-quantity').val());
        const total = (quantity * price);
        itemElement.find('.item-total').text('LKR ' + total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    }

    updateOrderTotal() {
        let total = 0;
        $('.order-item').each(function() {
            const itemTotalText = $(this).find('.item-total').text().replace('LKR ', '').replace(/,/g, '');
            const itemTotal = parseFloat(itemTotalText);
            total += itemTotal;
        });
        $('#order-total').text('LKR ' + total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    }

    clearOrderForm() {
        this.customerSelect.val('');
        this.orderItems.empty();
        $('#order-total').text('LKR 0.00');
    }

    getOrderData() {
        const customerId = this.customerSelect.val();
        const items = [];

        $('.order-item').each(function() {
            const itemId = parseInt($(this).data('id'));
            const quantity = parseInt($(this).find('.item-quantity').val());
            const itemName = $(this).find('h6').text();
            const itemPriceText = $(this).find('small').text().split(' - LKR ')[1];
            const itemPrice = parseFloat(itemPriceText.replace(/,/g, ''));

            items.push({
                id: itemId,
                name: itemName,
                price: itemPrice,
                quantity: quantity
            });
        });

        const total = parseFloat($('#order-total').text().replace('LKR ', '').replace(/,/g, ''));

        return {
            customerId: customerId,
            items: items,
            total: total
        };
    }

    bindAddItemToOrder(handler) {
        $(document).on('click', '.available-item', function() {
            const id = parseInt($(this).data('id'));
            handler(id);
        });
    }

    bindQuantityChange(handler) {
        $(document).on('change', '.item-quantity', function() {
            handler($(this));
        });
    }

    bindRemoveItem(handler) {
        $(document).on('click', '.remove-item', function() {
            handler($(this));
        });
    }

    bindPlaceOrder(handler) {
        $('#place-order-btn').on('click', handler);
    }

    showAlert(message, type = 'success') {
        alert(`${type.toUpperCase()}: ${message}`);
    }
}