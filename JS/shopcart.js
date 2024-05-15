class ShoppingCart {
  constructor() {
    this.items = [];
  }
  calculateTotal() {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  addItem(name, price, imageUrl) {
    const item = this.items.find((item) => item.name === name);
    if (item) {
      item.quantity++;
    } else {
      this.items.push({ name, price, imageUrl, quantity: 1 });
    }
    this.displayCart();
  }

  removeItem(name) {
    this.items = this.items.filter((item) => item.name !== name);
    this.displayCart();
  }

  updateQuantity(name, quantity) {
    const item = this.items.find((item) => item.name === name);
    if (item) {
      item.quantity = quantity;
      this.displayCart();
      document.querySelector(
        ".totals"
      ).textContent = `Total: $${this.calculateTotal().toFixed(2)}`;
    }
  }
recalculateCart() {
  let subtotal = 0;

  this.items.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  const totalElement = document.querySelector("#cart-total");
  const checkoutButton = document.querySelector(".checkout");

  if (totalElement) totalElement.textContent = 'Total: ' + subtotal.toFixed(2) + ' €';

  if (checkoutButton) {
    if (subtotal === 0) {
      checkoutButton.style.display = "none";
    } else {
      checkoutButton.style.display = "block";
    }
  }
}

  displayCart() {
    const cartDiv = document.querySelector(".shopping-cart");
    cartDiv.innerHTML = `
  ${this.items
    .map(
      (item) => `
    <div class="product">
      <div class="product-image">
        <img src="${item.imageUrl}">
      </div>
      <div class="product-details">
        <div class="product-title">${item.name}</div>
      </div>
      <div class="product-price">
        <label>Price</label>
        ${item.price} €
      </div>
      <div class="product-quantity">
        <label>Quantity</label>
        <input type="number" value="${item.quantity}" min="1" data-name="${
        item.name
      }">
      </div>
      <div class="product-removal">
        <button class="remove-product" data-name="${item.name}">
          Remove
        </button>
      </div>
      <div class="product-line-price">
        <label>Total</label>
        ${item.price * item.quantity} €
      </div>
    </div>
  `
    )
    .join("")}
  <div class="totals">
    <div id="cart-total"></div>
  </div>
  <button class="checkout">Checkout</button>
`;
  this.recalculateCart();

    document.querySelectorAll(".remove-product").forEach((button) => {
      button.addEventListener("click", (event) => {
        this.removeItem(event.target.dataset.name);
      });
    });

    document.querySelectorAll(".product-quantity input").forEach((input) => {
      input.addEventListener("input", (event) => {
        const quantity = parseInt(event.target.value);
        if (quantity >= 1) {
          this.updateQuantity(event.target.dataset.name, quantity);
        } else {
          event.target.value = 1;
        }
      });
    });
  }

  updateQuantity(name, quantity) {
    const item = this.items.find((item) => item.name === name);
    if (item) {
      item.quantity = quantity;
      this.displayCart();
      this.recalculateCart();
    }
  }
}


const cart = new ShoppingCart();
cart.addItem("Sushi Set 1", 10, "../images/product2.png");
cart.addItem("Sushi Set 2", 15, "../images/product1.jpg");

document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("add")) {
    const name = event.target.dataset.name;
    const item = cart.items.find((item) => item.name === name);
    cart.addItem(item.name, item.price, item.imageUrl);
  }
});

cart.displayCart();
