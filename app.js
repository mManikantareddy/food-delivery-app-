// Sample Mock Data for Food Items
const foodItems = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    category: "Burger",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    description: "Juicy beef patty with cheddar cheese, lettuce, and special sauce."
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80",
    description: "Crispy crust topped with mozzarella cheese and fresh pepperoni."
  },
  {
    id: 3,
    name: "Salmon Sushi Roll",
    category: "Asian",
    price: 12.50,
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&q=80",
    description: "Fresh salmon, avocado, and sushi rice wrapped in nori seaweed."
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    category: "Dessert",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80",
    description: "Warm chocolate cake filled with rich molten chocolate center."
  },
  {
    id: 5,
    name: "Veggie Supreme Pizza",
    category: "Pizza",
    price: 13.49,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
    description: "Loaded with bell peppers, onions, olives, and mushrooms."
  },
  {
    id: 6,
    name: "Crispy Chicken Burger",
    category: "Burger",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&q=80",
    description: "Crispy fried chicken breast with mayo and fresh pickles."
  }
];

// Shopping Cart State
let cart = [];

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  renderFoodCards(foodItems);
  setupEventListeners();
});

// Render Food Cards to UI
function renderFoodCards(items) {
  const container = document.getElementById("food-container");
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = `<div class="col-12 text-center text-muted py-5"><h5>No food items match your criteria.</h5></div>`;
    return;
  }

  items.forEach(item => {
    const cardHtml = `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0">
          <img src="${item.image}" class="card-img-top" alt="${item.name}">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title fw-bold mb-0">${item.name}</h5>
              <span class="badge bg-secondary">${item.category}</span>
            </div>
            <p class="card-text text-muted small flex-grow-1">${item.description}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="fs-5 fw-bold text-danger">$${item.price.toFixed(2)}</span>
              <button class="btn btn-outline-danger btn-sm" onclick="addToCart(${item.id})">
                <i class="bi bi-plus-circle"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += cardHtml;
  });
}

// Event Listeners for Search and Filtering
function setupEventListeners() {
  // Search Bar Input
  document.getElementById("search-input").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = foodItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query)
    );
    renderFoodCards(filtered);
  });

  // Category Filter Buttons
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("btn-danger", "active");
        b.classList.add("btn-outline-danger");
      });
      btn.classList.remove("btn-outline-danger");
      btn.classList.add("btn-danger", "active");

      const category = btn.getAttribute("data-category");
      if (category === "All") {
        renderFoodCards(foodItems);
      } else {
        const filtered = foodItems.filter(item => item.category === category);
        renderFoodCards(filtered);
      }
    });
  });

  // Proceed to Checkout Button
  document.getElementById("btn-proceed-checkout").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    document.getElementById("checkout-section").classList.remove("d-none");
    document.getElementById("cart-modal-footer").classList.add("d-none");
  });

  // Checkout Form Submission
  document.getElementById("checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    cart = [];
    updateCartUI();

    // Reset modals
    const cartModalEl = document.getElementById("cartModal");
    const cartModal = bootstrap.Modal.getInstance(cartModalEl);
    cartModal.hide();

    // Reset form view
    document.getElementById("checkout-section").classList.add("d-none");
    document.getElementById("cart-modal-footer").classList.remove("d-none");
    document.getElementById("checkout-form").reset();

    // Show confirmation modal
    const confirmModal = new bootstrap.Modal(document.getElementById("confirmationModal"));
    confirmModal.show();
  });
}

// Add Item to Cart
function addToCart(itemId) {
  const existingItem = cart.find(item => item.id === itemId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const food = foodItems.find(f => f.id === itemId);
    cart.push({ ...food, quantity: 1 });
  }
  updateCartUI();
}

// Change Quantity (+ / -)
function updateQuantity(itemId, change) {
  const item = cart.find(i => i.id === itemId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== itemId);
  }
  updateCartUI();
}

// Remove Item Entirely
function removeFromCart(itemId) {
  cart = cart.filter(i => i.id !== itemId);
  updateCartUI();
}

// Synchronize Cart State with UI
function updateCartUI() {
  const cartBadge = document.getElementById("cart-badge");
  const cartContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  // Calculate total count and sum
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  cartBadge.textContent = totalCount;
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `<div class="text-center text-muted py-4">Your cart is empty.</div>`;
    return;
  }

  cart.forEach(item => {
    const itemHtml = `
      <div class="list-group-item d-flex justify-content-between align-items-center py-3">
        <div>
          <h6 class="mb-0 fw-bold">${item.name}</h6>
          <small class="text-muted">$${item.price.toFixed(2)} each</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span class="fw-bold px-2">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
          <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeFromCart(${item.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `;
    cartContainer.innerHTML += itemHtml;
  });
}
