
export default class OrderModel {
    constructor(order_id, order_date, customer_id, item_id, order_qty, total, cash, discount, balance) {
        this._order_id = order_id;
        this._order_date = order_date;
        this._customer_id = customer_id;
        this._item_id = item_id;
        this._order_qty = order_qty;
        this._total = total;
        this._cash = cash;
        this._discount = discount;
        this._balance = balance;
    }

    get order_id() {
        return this._order_id;
    }

    set order_id(value) {
        this._order_id = value;
    }

    get order_date() {
        return this._order_date;
    }

    set order_date(value) {
        this._order_date = value;
    }

    get customer_id() {
        return this._customer_id;
    }

    set customer_id(value) {
        this._customer_id = value;
    }

    get item_id() {
        return this._item_id;
    }

    set item_id(value) {
        this._item_id = value;
    }

    get order_qty() {
        return this._order_qty;
    }

    set order_qty(value) {
        this._order_qty = value;
    }

    get total() {
        return this._total;
    }

    set total(value) {
        this._total = value;
    }

    get cash() {
        return this._cash;
    }

    set cash(value) {
        this._cash = value;
    }

    get discount() {
        return this._discount;
    }

    set discount(value) {
        this._discount = value;
    }

    get balance() {
        return this._balance;
    }

    set balance(value) {
        this._balance = value;
    }
}
