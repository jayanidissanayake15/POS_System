import OrderModel from "../model/orderModel.js";
import {order_array} from "../db/database.js";

import {customer_array} from "../db/database.js";

import {item_array} from "../db/database.js";

import orderItemModel from "../model/orderItemModel.js";
import {orderItem_array} from "../db/database.js";


const clearOrderForm = () =>{
    $('#orderID').val("");
    $('#date').val("");
    $('#orderCustomerID').val("");
    $('#customerName').val("");
    $('#customerAddress').val("");
    $('#orderItemID').val("");
    $('#orderItemName').val("");
    $('#orderItemPrice').val("");
    $('#itemQty').val("");
    $('#orderQty').val("");
    $('#totalAmount').text("0.00");
    $('#cash').val("");
    $('#discount').val("");
    $('#balance').val("");
}

const clearAddItemForm = () =>{
    $('#orderItemID').val("");
    $('#orderItemName').val("");
    $('#orderItemPrice').val("");
    $('#itemQty').val("");
    $('#orderQty').val("");
}

const clearOrderItemTable = () => {
    $("#orderItemTableBody").empty();
};

const loadOrderItemTable = (orderId) => {
    $("#orderItemTableBody").empty();
    let filteredItems = orderItem_array.filter(item => item.orderId === orderId);

    filteredItems.forEach(orderItem_object => {
        let data = `<tr>
            <td>${orderItem_object.orderItemId}</td>
            <td>${orderItem_object.orderItemName}</td>
            <td>${orderItem_object.orderItemPrice}</td>
            <td>${orderItem_object.orderQty}</td>
            <td>${(orderItem_object.orderItemPrice * orderItem_object.orderQty).toFixed(2)}</td> 
        </tr>`
        $("#orderItemTableBody").append(data);
    });
};

$("#addItemButton").on('click', function() {
    let orderId = $('#orderID').val() || generateOrderId();
    let orderItemId = $('#orderItemID').val();
    let orderItemName = $('#orderItemName').val();
    let orderItemPrice = parseFloat($("#orderItemPrice").val());
    let availableQty = parseInt($('#itemQty').val());
    let orderQty = parseFloat($("#orderQty").val());
    
    if(!orderId || orderId.length === 0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Order Id!",
        });
        return;
    }
    
    if(orderQty > availableQty){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Not enough quantity!",
        });
        return;
    }
    
    if(!orderItemId || orderItemId.length === 0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Item Id!",
        });
        return;
    }
    
    if(!orderItemName || orderItemName.length === 0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Item Name!",
        });
        return;
    }
    
    if(isNaN(orderItemPrice) || orderItemPrice <= 0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Item Price!",
        });
        return;
    }
    
    if(isNaN(availableQty) || availableQty <= 0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Available Qty!",
        });
        return;
    }
    
    if(isNaN(orderQty) || orderQty <= 0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Order Qty!",
        });
        return;
    }

    let total = orderItemPrice * orderQty;
    
    if(isNaN(total) || total <= 0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Total!",
        });
        return;
    }

    let orderItem = new orderItemModel(
        orderId,
        orderItemId,
        orderItemName,
        orderItemPrice,
        availableQty,
        orderQty,
        total
    );
    
    orderItem_array.push(orderItem);
    console.log(orderItem_array);
    loadOrderItemTable(orderId);
    updateItemArray();
    calculateOverallTotal(orderId);
    clearAddItemForm();
});

function calculateOverallTotal(orderId) {
    let orderTotal = orderItem_array
        .filter(item => item.orderId === orderId)
        .reduce((accumulator, item) => {
            return accumulator + (item._total || 0);
        }, 0);

    document.querySelector("#totalAmount").innerText = orderTotal.toFixed(2);
}

$(document).ready(function (){
    $("#orderID").val(generateOrderId());
    setCurrentDate();
});

let generateOrderId = function() {
    let id = order_array.length + 1;
    return "O00" + id;
}

let setOrderId = () => {
    $("#orderID").val(generateOrderId());
}

let setCurrentDate = () => {
    let today = new Date();
    let formattedDate = today.toISOString().split('T')[0];
    $("#date").val(formattedDate);
}

export function loadCustomers() {
    $("#orderCustomerID").empty();
    $("#orderCustomerID").append('<option value="" selected disabled>Select Customer</option>');
    
    customer_array.forEach((item) => {
        let data = `<option value="${item._customer_id}">${item._customer_id} - ${item.firstname} ${item.lastname}</option>`;
        $("#orderCustomerID").append(data);
    });
}

$("#orderCustomerID").on('change', function (){
    let id = $(this).val();
    let customer = customer_array.find(item => item._customer_id === id);

    if(customer){
        $("#customerName").val(customer.firstname + " " + customer.lastname);
        $("#customerAddress").val(customer.address);
    } else {
        $("#customerName").val("");
        $("#customerAddress").val("");
    }
});

export function loadItems(){
    $("#orderItemID").empty();
    $("#orderItemID").append('<option value="" selected disabled>Select Item</option>');
    
    item_array.forEach((item) => {
        let data = `<option value="${item._itemId}">${item._itemId} - ${item.itemName}</option>`;
        $("#orderItemID").append(data);
    });
}

$("#orderItemID").on('change', function (){
    let id = $(this).val();
    let item = item_array.find(item => item._itemId === id);

    if(item){
        $("#orderItemName").val(item.itemName);
        $("#orderItemPrice").val(item.UnitPrice);
        $("#itemQty").val(item.Quantity);
        $("#orderQty").val(""); 
    } else {
        $("#orderItemName").val("");
        $("#orderItemPrice").val("");
        $("#itemQty").val("");
        $("#orderQty").val("");
    }
});

$('#getBalance').on('click', function (){
    let total = parseFloat(document.querySelector("#totalAmount").innerText) || 0;
    let cash = parseFloat($("#cash").val()) || 0;
    let discount = parseFloat($("#discount").val()) || 0;
    
    let discountAmount = total * (discount / 100);
    
    let finalTotal = total - discountAmount;
    
    let balance = cash - finalTotal;
    
    $("#balance").val(balance.toFixed(2));
});

$('#placeOrderButton').on('click', function (){
    let orderId = $('#orderID').val();
    let date = $("#date").val();
    let orderCustomerId = $("#orderCustomerID").val();
    let cash = parseFloat($("#cash").val()) || 0;
    let discount = parseFloat($("#discount").val()) || 0;
    let balance = parseFloat($("#balance").val()) || 0;
    
    let orderItems = orderItem_array.filter(item => item.orderId === orderId);
    
    if (orderItems.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No items added to the order!",
        });
        return;
    }
    
    let total = orderItems.reduce((sum, item) => sum + (item._total || 0), 0);
    
    if (!orderId) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Order Id!",
        });
        return;
    } else if (!date) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Date!",
        });
        return;
    } else if (!orderCustomerId) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please select a customer!",
        });
        return;
    } else if (isNaN(total) || total <= 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Total Amount!",
        });
        return;
    } else if (isNaN(cash) || cash < 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Cash Amount!",
        });
        return;
    } else if (isNaN(discount) || discount < 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Discount!",
        });
        return;
    } else if (isNaN(balance)) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid Balance Calculation!",
        });
        return;
    } else if (cash < (total - (total * discount / 100))) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Insufficient cash amount!",
        });
        return;
    }
    
    orderItems.forEach(orderItem => {
        let order = new OrderModel(
            orderId,
            date,
            orderCustomerId,
            orderItem.orderItemId,
            orderItem.orderQty,
            orderItem._total,
            cash,
            discount,
            balance
        );
        order_array.push(order);
    });
    
    clearOrderForm();
    setOrderId();
    setCurrentDate();
    clearOrderItemTable();
    
    Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Order Placed Successfully!",
        showConfirmButton: false,
        timer: 1500
    });
});

function updateItemArray() {
    let item_code = $("#orderItemID").val();
    let qtyOnHand = parseInt($("#itemQty").val());
    let qty = parseInt($("#orderQty").val());

    let item = item_array.find(item => item._itemId === item_code);

    if (item) {
        item._Quantity = qtyOnHand - qty;
        console.log("Updated Item Quantity:", item._Quantity);
    } else {
        console.error(`Item not found in itemArray for code: ${item_code}`);
    }
}

// Initialize when page loads
$(document).ready(function() {
    loadCustomers();
    loadItems();
    setOrderId();
    setCurrentDate();
});