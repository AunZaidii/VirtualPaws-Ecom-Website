 // Wishlist Data
    let wishlistItems = [
      {
        id: '1',
        name: 'Premium Dog Food Bowl',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1598134493179-51332e56807f?w=400',
        inStock: true
      },
      {
        id: '2',
        name: 'Interactive Cat Toy Mouse',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1759720488555-d4ca178c2543?w=400',
        inStock: true
      },
      {
        id: '3',
        name: 'Adjustable Pet Collar & Leash Set',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1596822316110-288c7b8f24f8?w=400',
        inStock: false
      },
      {
        id: '4',
        name: 'Comfortable Dog Bed Cushion',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1676374024221-318172d3671a?w=400',
        inStock: true
      }
    ];

    // Toast Notification Function
    function showToast(message, type = 'success') {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.className = 'toast show ' + type;

      setTimeout(() => {
        toast.className = 'toast';
      }, 3000);
    }

    // Remove Item from Wishlist
    function removeItem(id) {
      wishlistItems = wishlistItems.filter(item => item.id !== id);
      renderWishlist();
      showToast('Item removed from wishlist', 'success');
    }

    // Add Item to Cart
    function addToCart(id) {
      const item = wishlistItems.find(item => item.id === id);
      if (item) {
        showToast(item.name + ' added to cart', 'success');
      }
    }

    // Render Wishlist Items
    function renderWishlist() {
      const grid = document.getElementById('wishlistGrid');
      const emptyState = document.getElementById('emptyState');
      const countElement = document.getElementById('wishlistCount');

      if (wishlistItems.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        countElement.textContent = '';
        return;
      }

      emptyState.style.display = 'none';
      countElement.textContent = wishlistItems.length + (wishlistItems.length === 1 ? ' item' : ' items') + ' in your wishlist';

      grid.innerHTML = wishlistItems.map(item => `
        <div class="wishlist-item">
          <div class="item-image-container">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <button class="remove-btn" onclick="removeItem('${item.id}')" aria-label="Remove item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            ${!item.inStock ? `
              <div class="out-of-stock-overlay">
                <span class="out-of-stock-badge">Out of Stock</span>
              </div>` : ''}
          </div>
          <div class="item-details">
            <h3 class="item-name">${item.name}</h3>
            <p class="item-price">$${item.price.toFixed(2)}</p>
            <button 
              class="add-to-cart-btn" 
              onclick="addToCart('${item.id}')"
              ${!item.inStock ? 'disabled' : ''}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              ${item.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      `).join('');
    }

    document.addEventListener('DOMContentLoaded', renderWishlist);