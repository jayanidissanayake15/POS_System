
export default class orderItemModel{


    constructor(orderId,orderItemId,orderItemName,orderItemPrice,availableQty,orderQty,total) {
        this._orderId = orderId;
        this._orderItemId = orderItemId;
        this._orderItemName = orderItemName;
        this._orderItemPrice = orderItemPrice;
        this._availableQty =availableQty;
        this._orderQty = orderQty;
        this._total = total;
    }


    get orderId() {
        return this._orderId;
    }

    set orderId(value) {
        this._orderId = value;
    }

    get total() {
        return this._total;
    }

    set total(value) {
        this._total = value;
    }

    get orderItemId() {
        return this._orderItemId;
    }

    set orderItemId(value) {
        this._orderItemId = value;
    }

    get orderItemName() {
        return this._orderItemName;
    }

    set orderItemName(value) {
        this._orderItemName = value;
    }

    get orderItemPrice() {
        return this._orderItemPrice;
    }

    set orderItemPrice(value) {
        this._orderItemPrice = value;
    }

    get availableQty() {
        return this._availableQty;
    }

    set availableQty(value) {
        this._availableQty = value;
    }

    get orderQty() {
        return this._orderQty;
    }

    set orderQty(value) {
        this._orderQty = value;
    }
}
