
import {customer_array, order_array} from "../db/database.js";

$('#orderSearchBtn').on('click',function (){
    let searchOrder = $('#order_search').val().toLowerCase();

    let filteredOrders = order_array.filter((order) =>
        order.order_id.toLowerCase().includes(searchOrder) ||
        order.customer_id.toLowerCase().includes(searchOrder)

    );
    loadOrderTable2(filteredOrders.length ? filteredOrders : order_array);

})
function loadOrderTable2(orders) {
    $('#orderDetailsTableBody').empty();
    orders.forEach(order => {
        $('#orderDetailsTableBody').append(`
            <tr>
                <td>${order.order_id}</td>
                <td>${order.order_date}</td>
                <td>${order.customer_id}</td>
                <td>${order.item_id}</td>
                <td>${order.order_qty}</td>
                <td>${order.total}</td>
                <td>${order.cash}</td>
                <td>${order.discount}</td>
                <td>${order.balance}</td>
            </tr>
        `);
    });
}

const loadOrderTable = () =>{
    $("#orderDetailsTableBody").empty();
    order_array.map((order,index) =>{
        let data = `<tr>
                <td>${order.order_id}</td>
                <td>${order.order_date}</td>
                <td>${order.customer_id}</td>
                <td>${order.item_id}</td>
                <td>${order.order_qty}</td>
                <td>${order.total}</td>
                <td>${order.cash}</td>
                <td>${order.discount}</td>
                <td>${order.balance}</td>
                </tr>`
        $("#orderDetailsTableBody").append(data);
    })
}

$('#orderDetails_nav').on('click',function (){
    loadOrderTable();
})
