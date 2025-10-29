// Product Data - Prices in Kenyan Shillings (KES)
const products = [
    {
        id: 1,
        name: "Perforated Leather Clutch",
        category: "Clutches",
        price: 9100,
        description: "Elegant white leather clutch with decorative perforated design, perfect for casual and evening occasions.",
        image: "images/IMG-20240925-WA0252.jpg",
        featured: true
    },
    {
        id: 2,
        name: "Python Print Backpack",
        category: "Backpacks",
        price: 16900,
        description: "Stylish snakeskin pattern backpack with adjustable straps and secure drawstring closure.",
        image: "images/IMG-20240925-WA0250.jpg",
        featured: true
    },
    {
        id: 3,
        name: "Studded Leather Backpack - Tan",
        category: "Backpacks",
        price: 19500,
        description: "Premium tan leather backpack with woven detail and studded embellishments, featuring multiple compartments.",
        image: "images/IMG-20240925-WA0238.jpg",
        featured: true
    },
    {
        id: 4,
        name: "Studded Leather Backpack - Black",
        category: "Backpacks",
        price: 19500,
        description: "Sophisticated black leather backpack with woven patterns and decorative studs, ideal for daily use.",
        image: "images/IMG-20240925-WA0236.jpg",
        featured: false
    },
    {
        id: 5,
        name: "Classic Black Backpack",
        category: "Backpacks",
        price: 11700,
        description: "Timeless black leather backpack with chain detail and secure flap closure, perfect for professionals.",
        image: "images/IMG-20240925-WA0235.jpg",
        featured: false
    },
    {
        id: 6,
        name: "Boho Crossbody Bag",
        category: "Crossbody",
        price: 10400,
        description: "Sleek black crossbody bag with colorful bohemian strap and minimalist design.",
        image: "images/IMG-20240925-WA0233.jpg",
        featured: true
    },
    {
        id: 7,
        name: "Navy Canvas Crossbody",
        category: "Crossbody",
        price: 7150,
        description: "Durable navy canvas crossbody bag with multiple zipper compartments and gold hardware.",
        image: "images/IMG-20240925-WA0231.jpg",
        featured: false
    },
    {
        id: 8,
        name: "Quilted Belt Bag",
        category: "Belt Bags",
        price: 5850,
        description: "Trendy two-tone quilted belt bag with adjustable strap, perfect for hands-free convenience.",
        image: "images/IMG-20240925-WA0229.jpg",
        featured: false
    },
    {
        id: 9,
        name: "Cognac Leather Backpack",
        category: "Backpacks",
        price: 18200,
        description: "Classic cognac leather backpack with drawstring and flap closure, featuring signature metal accent.",
        image: "images/IMG-20240925-WA0227.jpg",
        featured: true
    },
    {
        id: 10,
        name: "Professional Laptop Bag",
        category: "Laptop Bags",
        price: 15600,
        description: "Sleek black laptop bag with leather handles, perfect for work and business travel.",
        image: "images/IMG-20240925-WA0222.jpg",
        featured: true
    }
];

// Format currency to KES
function formatPrice(price) {
    return `KES ${price.toLocaleString('en-KE')}`;
}

// Cart Management
let cart = JSON.parse(localStorage.getItem('bagsMulanCart')) || [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('bagsMulanCart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count badge
function updateCartCount() {
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCountEl.textContent = totalItems;
    }
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    showNotification('Added to cart!');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartPage();
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            renderCartPage();
        }
    }
}

// Calculate cart total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #000;
        color: #D4AF37;
        padding: 1rem 2rem;
        border: 1px solid #D4AF37;
        z-index: 10000;
        font-size: 0.9rem;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Render products (for shop and home page)
function renderProducts(containerId, filterFeatured = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const productsToShow = filterFeatured
        ? products.filter(p => p.featured)
        : products;

    container.innerHTML = '';

    productsToShow.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card fade-in';
        productCard.style.animationDelay = `${index * 0.1}s`;

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;

        container.appendChild(productCard);
    });
}

// Render cart page
function renderCartPage() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSummary = document.getElementById('cartSummary');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <h3>Your cart is empty</h3>
                <p>Discover our luxury collection and find your perfect bag.</p>
                <a href="shop.html" class="btn btn-primary">Shop Now</a>
            </div>
        `;
        if (cartSummary) {
            cartSummary.innerHTML = '';
        }
        return;
    }

    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-category">${item.category}</p>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    if (cartSummary) {
        const subtotal = calculateTotal();
        const delivery = 500; // Flat delivery fee in KES
        const total = subtotal + delivery;

        cartSummary.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal</span>
                <span>${formatPrice(subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Delivery (Nairobi)</span>
                <span>${formatPrice(delivery)}</span>
            </div>
            <div class="summary-total">
                <span>Total</span>
                <span>${formatPrice(total)}</span>
            </div>
            <a href="checkout.html" class="btn btn-gold" style="width: 100%; display: block; text-align: center; margin-top: 1.5rem;">Proceed to Checkout</a>
            <a href="shop.html" class="btn btn-secondary" style="width: 100%; display: block; text-align: center; margin-top: 0.75rem;">Continue Shopping</a>
        `;
    }
}

// Render checkout page
function renderCheckoutPage() {
    const checkoutItems = document.getElementById('checkoutItems');
    const orderSummary = document.getElementById('orderSummary');

    if (!checkoutItems || !orderSummary) return;

    if (cart.length === 0) {
        window.location.href = 'shop.html';
        return;
    }

    checkoutItems.innerHTML = '';
    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.style.cssText = 'display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0;';
        itemEl.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span>${formatPrice(item.price * item.quantity)}</span>
        `;
        checkoutItems.appendChild(itemEl);
    });

    const subtotal = calculateTotal();
    const delivery = 500;
    const total = subtotal + delivery;

    orderSummary.innerHTML = `
        <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
        <div class="summary-row"><span>Delivery</span><span>${formatPrice(delivery)}</span></div>
        <div class="summary-total"><span>Total</span><span>${formatPrice(total)}</span></div>
    `;
}

// Handle checkout form submission
function handleCheckout(event) {
    event.preventDefault();

    // Store order details
    const orderDetails = {
        items: cart,
        total: calculateTotal() + 500,
        date: new Date().toISOString(),
        orderNumber: 'BWM' + Date.now().toString().slice(-8)
    };

    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));

    // Clear cart
    cart = [];
    saveCart();

    // Redirect to thank you page
    window.location.href = 'thankyou.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    // Render products on home page (featured)
    if (document.getElementById('featuredGrid')) {
        renderProducts('featuredGrid', true);
    }

    // Render products on shop page (all)
    if (document.getElementById('productsGrid')) {
        renderProducts('productsGrid', false);
    }

    // Render cart page
    if (document.getElementById('cartItemsContainer')) {
        renderCartPage();
    }

    // Render checkout page
    if (document.getElementById('checkoutItems')) {
        renderCheckoutPage();
    }

    // Handle checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Handle contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Display order details on thank you page
    if (document.getElementById('orderNumber')) {
        const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
        if (lastOrder) {
            document.getElementById('orderNumber').textContent = lastOrder.orderNumber;
            document.getElementById('orderTotal').textContent = formatPrice(lastOrder.total);
        }
    }
});
