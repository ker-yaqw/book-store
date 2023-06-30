window.addEventListener("DOMContentLoaded", () => {
  "use strict";

  let cartIcon = document.querySelector("#cart-icon");
  let cart = document.querySelector(".cart");
  let closeCart = document.querySelector("#cart-close");

  // open menu
  cartIcon.addEventListener("click", () => {
    cart.classList.add("cart--active");
  });
  // close menu
  closeCart.addEventListener("click", () => {
    cart.classList.remove("cart--active");
  });
});

//Cart woking to JS
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  const removeCartButtons = document.querySelectorAll(".cart-remove");

  removeCartButtons.forEach((button) => {
    button.addEventListener("click", removeCartItem);
  });

  // Quantity Change
  const quantityInputs = document.querySelectorAll(".cart-content-item__input");

  quantityInputs.forEach((input) => {
    input.addEventListener("change", quantityChanged);
  });

  //Add to cart
  const addCart  = document.querySelectorAll(".add-cart");
  
  addCart.forEach((button) => {
    button.addEventListener('click', addCartCliked);
  });

  loadCartItems ();
}

//Add Cart Function
function addCartCliked(e) {
  const button = e.target;
  const shopProducts = button.parentElement;
  const title = shopProducts.querySelector(".shop-content-item__title").innerText;
  const price = shopProducts.querySelector(".shop-content-item__price").innerText;
  const productImg = shopProducts.querySelector(".shop-content-item__image").src;
  addProductToCart(title, price, productImg);
  updateTotal();
  saveCartItems();
  updateCartIcon();
}

function addProductToCart(title, price, productImg) {
  const cartShopItem = document.createElement('div');
  cartShopItem.classList.add("cart-content-item");
  const cartItems = document.querySelector(".cart-content");
  const cartItemsTitle = cartItems.querySelectorAll(".cart-content-item__title");
  cartItemsTitle.forEach((title) => {
    if (title.innerText == title) {
      alert("You have already added this item to cart");
      return;
    }
  });
  const cartItemContent = `
    <img class="cart-content-item__image" src="${productImg}" alt="cart-img">
      <div class="cart-content-item__details">
          <div class="cart-content-item__title">${title}</div>
          <div class="cart-content-item__price">${price}</div>
          <input class="cart-content-item__input" type="number" name="" id="" value="1">    
      </div>
    <!-- remove item -->
    <i class='cart-remove bx bx-trash-alt'></i>
  `;
  cartShopItem.innerHTML = cartItemContent;
  cartItems.append(cartShopItem);
  cartShopItem.querySelector(".cart-remove").addEventListener("click" , removeCartItem);
  cartShopItem.querySelector(".cart-content-item__input").addEventListener("change" , quantityChanged);
  saveCartItems();
  updateCartIcon();
}

//Remove Cart Item
function removeCartItem(e) {
  const buttonClicked = e.target;
  buttonClicked.parentElement.remove();
  updateTotal();
  saveCartItems();
  updateCartIcon();
}

// Quantity Change
function quantityChanged(e) {
  const input = e.target;
  if (isNaN(input.value) || input.value <= 0 || input.value >= 50) {
    input.value = 1;
  }
  updateTotal();
  saveCartItems();
  updateCartIcon();
}

//Update Total
function updateTotal() {
  const cartContent = document.querySelector(".cart-content");
  const cartItems = cartContent.querySelectorAll(".cart-content-item");
  let total = 0;
  
  
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const priceItem = cartItem.querySelector(".cart-content-item__price");
    const quantityItem = cartItem.querySelector(".cart-content-item__input");
    const price = parseFloat(priceItem.innerText.replace("$", ""));
    const quantity = quantityItem.value;
    total += price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.querySelector(".cart-total__price").innerText = "$" + total;
  
  //Save Total to LocalStorage
  localStorage.setItem("cartTotal", total);
}

//localStorage

function saveCartItems() {
  const cartContent =  document.querySelector(".cart-content");
  const cartItem = cartContent.querySelectorAll(".cart-content-item");
  const cartItems = [];
  

  for (let i = 0; i < cartItem.length; i++ ) {
    const cartElement = cartItem[i];
    const titleElement = cartElement.querySelector(".cart-content-item__title");
    const priceElement = cartElement.querySelector(".cart-content-item__price");
    const quantityElement = cartElement.querySelector(".cart-content-item__input");
    const productImg = cartElement.getElementsByClassName("cart-content-item__image")[0].src;

    const item = {
      title: titleElement.innerText,
      price: priceElement.innerText,
      quantity: quantityElement.value,
      productImg : productImg,
    };
    cartItems.push(item);
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems)); 
}

//Loads in Cart

function loadCartItems () {
  let cartItems = localStorage.getItem("cartItems");
  
  if (cartItems) {
    cartItems = JSON.parse(cartItems);
   
    cartItems.forEach((item) => {
      addProductToCart(item.title, item.price, item.productImg);
      const quantityElement = document.querySelector(".cart-content-item__input");
      quantityElement.value = item.quantity;
    });
  }
  const cartTotal = localStorage.getItem("cartTotal");

  if (cartTotal) {
    document.querySelector(".cart-total__price").innerText = "$" + cartTotal;
  }
  updateCartIcon();
}

//Quantity in Cart Icon

function updateCartIcon() {
  const cartItems = document.querySelectorAll(".cart-content-item");
  let quantity = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const quantityElement = cartItem.querySelector(".cart-content-item__input");
    quantity += parseInt(quantityElement.value);
  }
  const cartIcon = document.querySelector("#cart-icon");
  cartIcon.setAttribute("data-quantity", quantity);
}

