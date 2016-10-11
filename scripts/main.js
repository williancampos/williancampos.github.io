/*
    Name:               Willian Campos
    Student number:     300879280
    File description:   File containing javascript code. Implements flow, validation, etc.
    File version:       1.0.0 
*/

var pizzas = [
    {name: 'Pepperoni', toppings: [0]},
    {name: 'Veggie', toppings: [11, 12, 13, 14, 16]},
    {name: 'Canadian', toppings: [0, 5, 13]},
    {name: 'Mexican', toppings: [4, 12, 14, 16]},
    {name: 'Hawaiian', toppings: [2, 15]},
    {name: 'Chicken Bacon', toppings: [5, 6, 7, 8, 13, 14]},
    {name: 'Bacon Cheddar', toppings: [4, 5, 7]},
    {name: 'Deluxe', toppings: [0, 1, 12, 13, 14]}
];
var toppingTypes = [
    {id: 0, name: 'Pepperoni', special: true},
    {id: 1, name: 'Sausage', special: true},
    {id: 2, name: 'Ham', special: true},
    {id: 3, name: 'Salami', special: true},
    {id: 4, name: 'Beef', special: true},
    {id: 5, name: 'Bacon', special: true},
    {id: 6, name: 'Chicken', special: true},
    {id: 7, name: 'Cheddar', special: true},
    {id: 8, name: 'Feta', special: true},
    {id: 9, name: 'Provolone', special: true},
    {id: 10, name: 'Green Olives', special: false},
    {id: 11, name: 'Black Olives', special: false},
    {id: 12, name: 'Peppers', special: false},
    {id: 13, name: 'Mushrooms', special: false},
    {id: 14, name: 'Onion', special: false},
    {id: 15, name: 'Pineapple', special: false},
    {id: 16, name: 'Tomatoes', special: false},
];
var doughTypes = [
    {id: 0, name: 'Thin'},
    {id: 1, name: 'Thick'}
];
var sizePrices = [
    {id: 0, name: 'Small', price: 8.0},
    {id: 1, name: 'Medium', price: 9.0},
    {id: 2, name: 'Large', price: 10.0},
    {id: 3, name: 'Extra-large', price: 11.0}
];
var toppingPrices = [
    {name: 'Regular', price: 1.0},
    {name: 'Special', price: 1.5}
];
var TAX_RATE = 0.13;

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function onLoadMain() {
    goToMenu();
}

function onLoadDetails() {
    var order = retrieveOrder();

    if (containsConfirmationDetails(order)) {
        goToConfirmation();
    }

    if (!order || !containsBasePizza(order)) {
        cancelDetail();
    }
    if (!containsPizzaDetails(order)) {
        var toppings = order.basePizza.toppings;
        for (k in toppings) {
            $('#topping' + toppings[k]).prop('checked', true);
        }
    } else {
        var orderDetails = order.pizzaDetails;
        //Set dough type
        $('#dough' + orderDetails.doughType.id).prop('checked', true);

        //Set dough whole weat
        $('#wholeWheat').prop('checked', orderDetails.isWholeWheat);

        //Set selected toppings 
        for (k in orderDetails.selectedToppings) {
            $('#topping' + orderDetails.selectedToppings[k].id).prop('checked', true);
        }

        //Set pizza size
        $('#size' + orderDetails.pizzaSize.id).prop('checked', true);
    }
}

function containsBasePizza(order) {
    if (order && order.basePizza) {
        return true;
    }
    return false;
}

function containsPizzaDetails(order) {
    if (order && order.pizzaDetails) {
        return true;
    }
    return false;
}

function containsCustomerDetails(order) {
    if (order && order.customerDetails) {
        return true;
    }
    return false;
}

function containsConfirmationDetails(order) {
    if (order && order.confirmationDetails) {
        return true;
    }
    return false;
}

function onLoadSummary() {
    var orderDetails = retrieveOrder();

    if (containsConfirmationDetails(orderDetails)) {
        goToConfirmation();
    }

    if (!containsPizzaDetails(orderDetails)) {
        goToDetail();
    }

    showSelection(orderDetails);
    showPrice(orderDetails);
}

function showSelection(orderDetails) {
    var basePizza = orderDetails.basePizza.name;
    var pizzaDetails = orderDetails.pizzaDetails;
    var dough = pizzaDetails.doughType.name;
    if (pizzaDetails.isWholeWheat) {
        dough = dough + ' (whole wheat)';
    }
    var toppings = [];
    for (k in pizzaDetails.selectedToppings) {
        toppings.push(pizzaDetails.selectedToppings[k].name);
    }
    var size = pizzaDetails.pizzaSize.name;

    $('#basePizza').html(basePizza);
    $('#dough').html(dough);
    $('#toppings').html(toppings.join(', '));
    $('#size').html(size);
}

function showPrice(orderDetails) {
    var size = orderDetails.pizzaDetails.pizzaSize;

    var regularToppings = [];
    var specialToppings = [];

    var selectedToppings = orderDetails.pizzaDetails.selectedToppings;
    for (k in selectedToppings) {
        var topping = selectedToppings[k];
        if (topping.special) {
            specialToppings.push(topping);
        } else {
            regularToppings.push(topping);
        }
    }

    var subTotal = calculateSubtotal(orderDetails);
    var tax = calculateTax(subTotal);
    var total = parseFloat(subTotal + tax);

    $('#tPizzaSize').html('1 x ' + size.name);
    $('#tPizzaSizePrice').html(size.price.toFixed(2));

    $('#tRegularToppings').html(regularToppings.length + ' x Regular toppings');
    $('#tRegularToppingsPrice').html((regularToppings.length * toppingPrices[0].price).toFixed(2));

    $('#tSpecialToppings').html(specialToppings.length + ' x Special toppings');
    $('#tSpecialToppingsPrice').html((specialToppings.length * toppingPrices[1].price).toFixed(2));
    
    $('#tSubTotal').html(subTotal.toFixed(2));
    $('#tTaxes').html(tax.toFixed(2));
    $('#tTotal').html(total.toFixed(2));
}

function onLoadConfirmation() {
    var orderDetails = retrieveOrder();

    if (!containsCustomerDetails(orderDetails)) {
        goToSummary();
    }

    var confirmationDetails;
    var subTotal;
    var tax;
    var total;
    var orderCode; 
    if (containsConfirmationDetails(orderDetails)) {
        confirmationDetails = orderDetails.confirmationDetails
        subTotal = confirmationDetails.subTotal;
        tax = confirmationDetails.tax;
        total = confirmationDetails.total;
        orderCode = confirmationDetails.code;
    } else {
        subTotal = calculateSubtotal(orderDetails);
        tax = calculateTax(subTotal);
        total = parseFloat(subTotal + tax);
        orderCode = parseInt(Math.random() * 100000000);

        orderDetails.confirmationDetails = {code: orderCode, subTotal: subTotal, tax: tax, total: total};
        setOrder(orderDetails);
    }

    $('#customerName').html(orderDetails.customerDetails.customerName.capitalizeFirstLetter());
    $('#orderCode').html(orderCode);
    $('#orderStatus').html('Paid');
    $('#orderSubtotal').html('CAD$ ' + subTotal.toFixed(2));
    $('#orderTaxes').html('CAD$ ' + tax.toFixed(2));
    $('#orderTotal').html('CAD$ ' + total.toFixed(2));
}

function calculateSubtotal(orderDetails) {
    var pizzaDetails = orderDetails.pizzaDetails;
    var price = 0.0;
    price += parseFloat(pizzaDetails.pizzaSize.price);

    var regularToppingPrice = toppingPrices[0];
    var specialToppingPrice = toppingPrices[1];

    for (k in pizzaDetails.selectedToppings) {
        if (pizzaDetails.selectedToppings[k].special) {
            price += specialToppingPrice.price;
        } else {
            price += regularToppingPrice.price;
        }
    }

    return price;
}

function calculateTax(orderSubTotal) {
    return orderSubTotal * TAX_RATE;
}


function cancelDetail() {
    clearOrder();
    window.location='menu.html';
}

function confirmDetail() {
    clearRequired();
    var doughType = doughTypes[parseInt($("input[name='dough']:checked").prop("id").substring(5))];
    var isWholeWheat = $('#wholeWheat').prop('checked');

    var selectedToppings = [];
    for (k=0; k <= 16; k++) {
        var toppingCheckBox = $('#topping' + k).prop('checked');
        if (toppingCheckBox) {
            selectedToppings.push(toppingTypes[k]);
        }
    }

    if (selectedToppings.length == 0) {
        $("#toppingRequired").css('display', 'inline');
        return;
    }

    var pizzaSize = sizePrices[parseInt($("input[name='size']:checked").prop("id").substring(4))];

    var orderDetails = retrieveOrder();
    orderDetails.pizzaDetails = {doughType: doughType, isWholeWheat: isWholeWheat, selectedToppings: selectedToppings, pizzaSize: pizzaSize};
    setOrder(orderDetails);
    goToSummary();
}

function cancelOrderSummary() {
    goToDetail();
}

function confirmOrderSummary() {
    clearRequired();
    var orderDetails = retrieveOrder();
    var empty = false;
    var customerName = $("#name").val();

    if (customerName.isEmpty()) {
        $("#nameRequired").css('display', 'inline');
        empty = true;
    }

    var customerAddress = $("#address").val();
    if (customerAddress.isEmpty()) {
        $("#addressRequired").css('display', 'inline');
        empty = true;
    } 

    var customerPhone = $("#phone").val();
    if (customerPhone.isEmpty()) {
        $("#phoneRequired").css('display', 'inline');
        empty = true;
    } 

    var customerCard = $("#card").val();
    if (customerCard.isEmpty()) {
        $("#cardRequired").css('display', 'inline');
        empty = true;
    }

    if (empty) {
        return;
    }

    orderDetails.customerDetails = {customerName: customerName, customerAddress: customerAddress, customerPhone: customerPhone, customerCard: customerCard};
    setOrder(orderDetails);
    goToConfirmation();
}

function clearRequired() {
    $('.show-required').hide();
}

function selectPizza(pizzaCode) {
    var pizzaIndex = parseInt(pizzaCode.substring(5));
    var selectedPizza = pizzas[pizzaIndex];
    setOrder({basePizza: selectedPizza});
    window.location='detail.html';
}

function startNewOrder() {
    clearOrder();
    goToMain();
}

function retrieveOrder() {
    return JSON.parse(sessionStorage.getItem("orderDetails"));
}

function setOrder(orderDetails) {
    sessionStorage.setItem("orderDetails", JSON.stringify(orderDetails));
}

function clearOrder() {
    sessionStorage.setItem("orderDetails", null);
}

function goToMain() {
    window.location='index.html';
}

function goToMenu() {
    window.location='menu.html';
}

function goToDetail() {
    window.location='detail.html';
}

function goToSummary() {
    window.location='order-summary.html';
}

function goToConfirmation() {
    window.location='order-confirmation.html';
}
