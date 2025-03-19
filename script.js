const restaurantMenus = {
    kfc: [
        { name: "Zinger Burger", price: 150, img: "images/zinger.jpg", count: 0 },
        { name: "Hot Wings", price: 120, img: "images/hotwings.jpg", count: 0 }
    ],
    mcdonalds: [
        { name: "Big Mac", price: 200, img: "images/bigmac.jpg", count: 0 },
        { name: "McFries", price: 100, img: "images/mcfries.jpg", count: 0 }
    ],
    subway: [
        { name: "Veggie Sub", price: 180, img: "images/veggie.jpg", count: 0 },
        { name: "Chicken Sub", price: 200, img: "images/chickensub.jpg", count: 0 }
    ],
    burgerking: [
        { name: "Whopper", price: 220, img: "images/whopper.jpg", count: 0 },
        { name: "Crispy Chicken", price: 190, img: "images/crispy.jpg", count: 0 }
    ]
};

// Load cart from sessionStorage or initialize it
let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

// Function to show the menu of a selected restaurant
function showMenu(restaurant) {
    const menuDiv = document.getElementById("menu-items");
    
    // Check if menu div exists
    if (!menuDiv) {
        console.error("Error: 'menu-items' div not found in HTML.");
        return;
    }

    menuDiv.innerHTML = ""; 

    restaurantMenus[restaurant].forEach((item, index) => {
        menuDiv.innerHTML += `
            <div class="menu-item">
                <img src="${item.img}" alt="${item.name}">
                <p>${item.name} - ₹${item.price}</p>
                <div class="counter">
                    <button onclick="updateCount('${restaurant}', ${index}, -1)">-</button>
                    <span id="count-${restaurant}-${index}">${getItemCount(item.name)}</span>
                    <button onclick="updateCount('${restaurant}', ${index}, 1)">+</button>
                </div>
            </div>
        `;
    });
}

// Get the current count of an item in the cart
function getItemCount(itemName) {
    let cartItem = cart.find(cartItem => cartItem.name === itemName);
    return cartItem ? cartItem.count : 0;
}

// Function to update item quantity in the cart
function updateCount(restaurant, index, change) {
    let item = restaurantMenus[restaurant][index];
    let existingItem = cart.find(cartItem => cartItem.name === item.name);

    if (existingItem) {
        existingItem.count = Math.max(0, existingItem.count + change);
        if (existingItem.count === 0) {
            cart = cart.filter(cartItem => cartItem.name !== item.name);
        }
    } else if (change > 0) {
        cart.push({ ...item, count: change });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    document.getElementById(`count-${restaurant}-${index}`).innerText = getItemCount(item.name);
}

// Function to update cart UI and total price
function updateCart() {
    const cartDiv = document.getElementById("cart-items");
    const totalAmountSpan = document.getElementById("total-amount");

    if (!cartDiv || !totalAmountSpan) {
        console.error("Error: 'cart-items' or 'total-amount' div not found in HTML.");
        return;
    }

    cartDiv.innerHTML = cart.map(cartItem => `
        <div class="cart-item">
            <p>${cartItem.name} - ₹${cartItem.price} x ${cartItem.count}</p>
        </div>
    `).join("");

    const totalAmount = cart.reduce((sum, cartItem) => sum + (cartItem.price * cartItem.count), 0);
    totalAmountSpan.innerText = totalAmount;

    sessionStorage.setItem("totalAmount", totalAmount);
}

// Load cart when the page loads
document.addEventListener("DOMContentLoaded", () => {
    updateCart();

    document.querySelectorAll(".payment-options button").forEach(button => {
        button.addEventListener("click", () => {
            if (cart.length > 0) {
                window.location.href = "payment.html";
            } else {
                alert("Your cart is empty! Add items before proceeding to payment.");
            }
        });
    });
});

// Function to calculate total amount for payment
function calculateTotalAmount() {
    return cart.reduce((sum, item) => sum + item.price * item.count, 0);
}

// Function to proceed to payment
function proceedToPayment() {
    let totalAmount = calculateTotalAmount();
    if (totalAmount > 0) {
        sessionStorage.setItem("totalAmount", totalAmount);
        window.location.href = "payment.html";
    } else {
        alert("Total amount cannot be zero! Please add items to the cart.");
    }
}
