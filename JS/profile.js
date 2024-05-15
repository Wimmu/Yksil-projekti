
const userId = 2;

// --------------------- API FUNCTIONS ----------------------------- //
async function fetchUsers() {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/v1/users/${userId}`);
        const data = await response.json();
        console.log('User data:', data)
        return data
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

async function fetchOrders() {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/v1/users/${userId}/orders`);
        const data = await response.json();
        console.log('Order data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

async function fetchMenuItems() {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/v1/items');
        const items = await response.json();
        console.log('Items:', items);
        return items
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// --------------------- DROP DOWN FUNCTIONS ------------------------- //
function toggleDropDowns(dropDown, button) {
    if (dropDown.classList.contains('hidden')) {
        dropDown.classList.remove('hidden');
        button.innerText = 'Hide';
    } else {
        dropDown.classList.add('hidden');
        button.innerText = 'Show';
    }
}
function toggleMotd() {
    const dropDown = document.querySelector('.motd-dropdown'); // Corrected
    const button = document.getElementById('motdToggleButton');
    toggleDropDowns(dropDown, button);
}

function toggleManagement() {
    const dropDown = document.querySelector('.management'); // Corrected
    const button = document.getElementById('managementToggleButton');
    toggleDropDowns(dropDown, button);
}

function toggleOrderHistory() {
    const orderHistory = document.getElementById('order-history');
    const button = document.getElementById('orderToggleButton');
    toggleDropDowns(orderHistory, button);
}

// --------------------- PROFILE ----------------------------- //
// Fetch user data and place it in the user profile
async function placeProfileData() {
    try {
        const userData = await fetchUsers(userId);
        document.getElementById('welcomeText').textContent = `Welcome to your profile, ${userData.first_name}!`;
        document.getElementById('userUsername').textContent = userData.username;
        document.getElementById('userFullName').textContent = userData.first_name + ' ' + userData.last_name;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('userAddress').textContent = userData.address;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Toggle the profile edit mode
function toggleProfileEdit() {
    var editButton = document.querySelector(".edit-details-btn");

    if (editButton.innerText === "Edit Account Details") {
        console.log("Editing account details.");
    } else {
        console.log("Account details saved.");
    }
}

// --------------------- ORDER HISTORY ----------------------------- //
// Fetch order data and place it in the order history
async function placeOrderData() {
    try {
        const orderData = await fetchOrders(userId);
        const orderHistory = document.getElementById('order-history');
        orderHistory.innerHTML = '';
        orderData.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order');
            const orderTop = document.createElement('div');
            orderTop.classList.add('order-top');
            const orderDate = new Date(order.date).toLocaleDateString('en-GB');
            const orderStatus = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            orderTop.innerHTML = `<h3>${orderDate}</h3><h3>${orderStatus}</h3>`;
            const orderInfo = document.createElement('div');
            orderInfo.innerHTML = `<p>Order ID: ${order.order_id}</p><p>Products: ${order.products}</p>`;
            orderDiv.appendChild(orderTop);
            orderDiv.appendChild(orderInfo);
            orderHistory.appendChild(orderDiv);
        });
        orderHistory.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching order data:', error);
    }
}

// --------------------- MEAL OF THE DAY ----------------------------- //
// Fetch menu items and place them in the dropdown
async function placeMotdData() {
    try {
        const items = await fetchMenuItems();
        const dropdownContent = document.getElementById('dropdownContent');
        dropdownContent.innerHTML = ''; // Clear previous dropdown content
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.onclick = () => selectItem(item.name, item.price, item.description, item.image);
            itemDiv.innerHTML = `
                <img src="/IMG/ruokakuvat/${item.image}" alt="${item.name}">
                <div class="item-info">
                    <p>${item.name}</p>
                    <p>${item.price}€</p>
                </div>
            `;
            dropdownContent.appendChild(itemDiv);
        });
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Toggle the dropdown menu
function toggleDropdown() {
    const dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.classList.toggle("show");
}

// Select an item from the dropdown and display it
function selectItem(name, price, description, image) {
    console.log('Selected item:', name, price, description, image);
    document.getElementById('selectedMealImage').setAttribute('src', `/IMG/ruokakuvat/${image}`);
    document.getElementById('selectedMeal').textContent = name;
    document.getElementById('selectedPrice').textContent = price + '€';
    document.getElementById('selectedDescription').textContent = description;
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.motd-select-dropdown')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// --------------------- MANAGEMENT ----------------------------- //
// Open the selected tab
function openTab(tabId) {
    var tabs = document.querySelectorAll('.product-tab');
    tabs.forEach(function(tab) {
        tab.classList.add('hidden');
    });

    var selectedTab = document.getElementById(tabId);
    selectedTab.classList.remove('hidden');
}

// Fetch menu items and place them in the dropdown
async function placeRemoveDropdownData() {
    try {
        const items = await fetchMenuItems();
        const productDropdown = document.getElementById('productDropdown');
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.name;
            option.text = `${item.name} - ${item.price}€`;
            productDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating dropdown:', error);
    }
}

// Add a remove product
async function removeProduct() {
    try {
        const productDropdown = document.getElementById('productDropdown');
        const productName = productDropdown.value;

        const confirmation = confirm(`Are you sure you want to remove ${productName}?`);

        if (confirmation) {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/items/${productName}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                console.log('Product deleted successfully');
                productDropdown.innerHTML = ''; // Clear dropdown after deletion
                await placeRemoveDropdownData(); // Refresh dropdown after deletion
            } else {
                console.error('Failed to delete product');
            }
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Save a new product
function saveProduct() {
    var productName = document.getElementById('productName').value;
    var productDescription = document.getElementById('productDescription').value;
    var productPrice = document.getElementById('productPrice').value;
    var productAllergens = document.getElementById('allergens').value;
    var productImage = document.getElementById('productImage').files[0];

    console.log('SAVING PRODUCT:', "\nName:",productName, "\nDescription:",productDescription, "\nPrice:",productPrice,"\nAllergens:",productAllergens,"\nImage:",productImage);
}

// --------------------- MAIN ----------------------------- //
document.addEventListener("DOMContentLoaded", () => {
    placeProfileData();
    placeOrderData();
    placeMotdData();
    placeRemoveDropdownData();
});
