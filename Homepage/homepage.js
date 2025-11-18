// Homepage Dynamic Data Loading
document.addEventListener('DOMContentLoaded', async function() {
    await loadLatestProducts();
    await loadFeaturedProducts();
    await loadDealsOfTheWeek();
    await loadTopCategories();
});

// Function to calculate average rating
function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
}

// Function to generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fa-solid fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fa-solid fa-star-half-stroke"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="fa-regular fa-star"></i>';
    }
    return stars;
}

// Load Latest/Trending Products
async function loadLatestProducts() {
    try {
        const { data: products, error } = await supabaseClient
            .from('product')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;

        console.log('Latest Products loaded:', products); // Debug log

        const productsContainer = document.querySelector('.latest-product-section .products');
        if (productsContainer && products && products.length > 0) {
            productsContainer.innerHTML = products.map(product => {
                // Use the rating directly from the product table (since your DB has a rating column)
                const rating = product.rating || 0;
                
                const hasDiscount = product.discount_price && product.discount_price < product.price;
                
                // Image mapping based on product names or use image_url from DB
                let imagePath = '';
                let hoverImagePath = '';
                
                // Check if product has image_url in database
                if (product.image_url && product.image_url.trim() !== '') {
                    imagePath = product.image_url;
                    // If it doesn't start with ./ or http, add the path
                    if (!imagePath.startsWith('./') && !imagePath.startsWith('http')) {
                        imagePath = './product images/' + imagePath;
                    }
                } else {
                    // Fallback: Try to map based on product name keywords
                    const productName = product.name.toLowerCase();
                    if (productName.includes('leather') && productName.includes('chew')) {
                        imagePath = './product images/leather-chew-toy.jpg';
                        hoverImagePath = './product images/leather-chew-toy-2.jpg';
                    } else if (productName.includes('bowl') && productName.includes('steel')) {
                        imagePath = './product images/dog bowl.jpg';
                        hoverImagePath = './product images/dog bowl 2.jpg';
                    } else if (productName.includes('velvet') && productName.includes('house')) {
                        imagePath = './product images/soft velvet house.jpg';
                        hoverImagePath = './product images/soft velvet house 2.jpg';
                    } else if (productName.includes('melamine') && productName.includes('bowl')) {
                        imagePath = './product images/stainless steel bowl.jpg';
                        hoverImagePath = './product images/stainless steel bowl 2.jpg';
                    } else if (productName.includes('christmas') || productName.includes('sweater')) {
                        imagePath = './product images/chritmas sweater dog.jpg';
                        hoverImagePath = './product images/chritmas sweater dog hover.jpg';
                    } else if (productName.includes('meat') && productName.includes('rice')) {
                        imagePath = './product images/meat and rice healthy food.jpg';
                        hoverImagePath = './product images/meat and rice healthy food hover.jpg';
                    } else if (productName.includes('puppy') && productName.includes('chicken')) {
                        imagePath = './product images/dry dog food chicken.jpg';
                        hoverImagePath = './product images/dry dog food chicken hover.jpg';
                    } else if (productName.includes('dentastix') || productName.includes('dental')) {
                        imagePath = './product images/cake treat.jpg';
                        hoverImagePath = './product images/cake treat 2.jpg';
                    } else {
                        // Default fallback
                        imagePath = './product images/leather-chew-toy.jpg';
                        hoverImagePath = './product images/leather-chew-toy-2.jpg';
                    }
                }
                
                // Set hover image if not already set
                if (!hoverImagePath) {
                    hoverImagePath = product.hover_image_url || imagePath;
                    if (hoverImagePath && !hoverImagePath.startsWith('./') && !hoverImagePath.startsWith('http')) {
                        hoverImagePath = './product images/' + hoverImagePath;
                    }
                }
                
                console.log('Product:', product.name, 'Image:', imagePath, 'Rating:', rating); // Debug
                
                return `
                    <a href="../Collection/product-detail.html?id=${product.id}">
                        <div class="product-div">
                            <div class="product-image-div">
                                <img class="product-image" src="${imagePath}" alt="${product.name}">
                                <img class="product-image-hover" src="${hoverImagePath}" alt="${product.name}">
                            </div>
                            <div class="product-text-div">
                                <p class="product-text-title">${product.name}</p>
                                <p class="product-text-rating">${generateStarRating(rating)}</p>
                                <p class="product-text-price">
                                    ${hasDiscount ? `<span style="text-decoration: line-through; color: rgb(101, 100, 100);">$${product.price.toFixed(2)}</span> ` : ''}
                                    <span style="color: rgb(135, 218, 72); font-weight: bold;">$${(hasDiscount ? product.discount_price : product.price).toFixed(2)}</span>
                                </p>
                            </div>
                        </div>
                    </a>
                `;
            }).join('');
        } else {
            productsContainer.innerHTML = '<p style="text-align: center; width: 100%; padding: 2rem;">No products found. Please add products to the database.</p>';
        }
    } catch (error) {
        console.error('Error loading latest products:', error);
        const productsContainer = document.querySelector('.latest-product-section .products');
        if (productsContainer) {
            productsContainer.innerHTML = '<p style="text-align: center; width: 100%; padding: 2rem; color: red;">Error loading products. Check console for details.</p>';
        }
    }
}

// Load Featured Products (Best Products) - Sorted by Rating
async function loadFeaturedProducts() {
    try {
        const { data: products, error } = await supabaseClient
            .from('product')
            .select('*')
            .order('rating', { ascending: false })
            .limit(4);

        if (error) throw error;

        console.log('Featured Products loaded:', products); // Debug log

        const productsGrid = document.querySelector('.best-products-grid');
        if (productsGrid && products && products.length > 0) {
            productsGrid.innerHTML = products.map(product => {
                // Use the rating directly from the product table
                const rating = product.rating || 0;
                const hasDiscount = product.discount_price && product.discount_price < product.price;
                
                // Image mapping based on product names or use image_url from DB
                let imagePath = '';
                let hoverImagePath = '';
                
                // Check if product has image_url in database
                if (product.image_url && product.image_url.trim() !== '') {
                    imagePath = product.image_url;
                    if (!imagePath.startsWith('./') && !imagePath.startsWith('http')) {
                        imagePath = './product images/' + imagePath;
                    }
                } else {
                    // Fallback: Try to map based on product name keywords
                    const productName = product.name.toLowerCase();
                    if (productName.includes('leather') && productName.includes('chew')) {
                        imagePath = './product images/leather-chew-toy.jpg';
                        hoverImagePath = './product images/leather-chew-toy-2.jpg';
                    } else if (productName.includes('bowl') && productName.includes('steel')) {
                        imagePath = './product images/dog bowl.jpg';
                        hoverImagePath = './product images/dog bowl 2.jpg';
                    } else if (productName.includes('velvet') && productName.includes('house')) {
                        imagePath = './product images/soft velvet house.jpg';
                        hoverImagePath = './product images/soft velvet house 2.jpg';
                    } else if (productName.includes('melamine') && productName.includes('bowl')) {
                        imagePath = './product images/stainless steel bowl.jpg';
                        hoverImagePath = './product images/stainless steel bowl 2.jpg';
                    } else if (productName.includes('christmas') || productName.includes('sweater')) {
                        imagePath = './product images/chritmas sweater dog.jpg';
                        hoverImagePath = './product images/chritmas sweater dog hover.jpg';
                    } else if (productName.includes('meat') && productName.includes('rice')) {
                        imagePath = './product images/meat and rice healthy food.jpg';
                        hoverImagePath = './product images/meat and rice healthy food hover.jpg';
                    } else if (productName.includes('puppy') && productName.includes('chicken')) {
                        imagePath = './product images/dry dog food chicken.jpg';
                        hoverImagePath = './product images/dry dog food chicken hover.jpg';
                    } else if (productName.includes('dentastix') || productName.includes('dental')) {
                        imagePath = './product images/cake treat.jpg';
                        hoverImagePath = './product images/cake treat 2.jpg';
                    } else {
                        imagePath = './product images/leather-chew-toy.jpg';
                        hoverImagePath = './product images/leather-chew-toy-2.jpg';
                    }
                }
                
                // Set hover image if not already set
                if (!hoverImagePath) {
                    hoverImagePath = product.hover_image_url || imagePath;
                    if (hoverImagePath && !hoverImagePath.startsWith('./') && !hoverImagePath.startsWith('http')) {
                        hoverImagePath = './product images/' + hoverImagePath;
                    }
                }
                
                console.log('Featured Product:', product.name, 'Image:', imagePath, 'Rating:', rating);
                
                return `
                    <a href="../Collection/product-detail.html?id=${product.id}">
                        <div class="best-product-flexbox">
                            <div class="best-product-image-div">
                                <img class="best-product-image" src="${imagePath}" alt="${product.name}">
                                <img class="best-product-image-hover" src="${hoverImagePath}" alt="${product.name}">
                            </div>
                            <div class="best-product-text-div">
                                <p class="best-product-text-title">${product.name}</p>
                                <p class="best-product-text-rating">${generateStarRating(rating)}</p>
                                <p class="best-product-text-price">
                                    ${hasDiscount ? `<span style="text-decoration: line-through; color: rgb(101, 100, 100); padding-right: 0.6vw;">$${product.price.toFixed(2)}</span>` : ''}
                                    <span style="color: rgb(135, 218, 72); font-weight: bolder;">$${(hasDiscount ? product.discount_price : product.price).toFixed(2)}</span>
                                </p>
                                <p class="best-product-addtocart" style="color: black;">Add To Cart</p>
                            </div>
                        </div>
                    </a>
                `;
            }).join('');
        } else {
            productsGrid.innerHTML = '<p style="text-align: center; width: 100%; padding: 2rem;">No featured products found.</p>';
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
        const productsGrid = document.querySelector('.best-products-grid');
        if (productsGrid) {
            productsGrid.innerHTML = '<p style="text-align: center; width: 100%; padding: 2rem; color: red;">Error loading products. Check console for details.</p>';
        }
    }
}

// Load Deals of the Week
async function loadDealsOfTheWeek() {
    try {
        const { data: products, error } = await supabaseClient
            .from('product')
            .select(`
                *,
                product_review(rating)
            `)
            .not('discount_price', 'is', null)
            .order('discount_price', { ascending: true })
            .limit(5);

        if (error) throw error;

        // Find the second products container (Deals of the Week section)
        const allProductsSections = document.querySelectorAll('.latest-product-section');
        const dealsSection = allProductsSections[1]; // Second occurrence
        
        if (dealsSection && products) {
            const productsContainer = dealsSection.querySelector('.products');
            if (productsContainer) {
                productsContainer.innerHTML = products.map(product => {
                    const avgRating = calculateAverageRating(product.product_review);
                    const hasDiscount = product.discount_price && product.discount_price < product.price;
                    
                    return `
                        <a href="../Collection/product-detail.html?id=${product.id}">
                            <div class="product-div">
                                <div class="product-image-div">
                                    <img class="product-image" src="${product.image_url || './product images/placeholder.jpg'}" alt="${product.name}">
                                    <img class="product-image-hover" src="${product.hover_image_url || product.image_url || './product images/placeholder.jpg'}" alt="${product.name}">
                                </div>
                                <div class="product-text-div">
                                    <p class="product-text-title">${product.name}</p>
                                    <p class="product-text-rating">${generateStarRating(avgRating)}</p>
                                    <p class="product-text-price">
                                        ${hasDiscount ? `<span style="text-decoration: line-through; color: rgb(101, 100, 100);">$${product.price.toFixed(2)}</span> ` : ''}
                                        <span style="color: rgb(135, 218, 72); font-weight: bold;">$${(hasDiscount ? product.discount_price : product.price).toFixed(2)}</span>
                                    </p>
                                </div>
                            </div>
                        </a>
                    `;
                }).join('');
            }
        }
    } catch (error) {
        console.error('Error loading deals of the week:', error);
    }
}

// Load Top Categories - Show 4 main categories: Cat Accessories, Cat Food, Dog Accessories, Dog Food
async function loadTopCategories() {
    try {
        // Define the 4 categories to display
        const categories = ['Cat Accessories', 'Cat Food', 'Dog Accessories', 'Dog Food'];
        
        // Fetch one product from each category
        const categoryPromises = categories.map(async (category) => {
            const { data: products, error } = await supabaseClient
                .from('product')
                .select('*')
                .eq('category', category)
                .order('rating', { ascending: false })
                .limit(1);
            
            if (error) {
                console.error(`Error loading ${category}:`, error);
                return null;
            }
            
            // Return the category info with the top product (or just category if no products)
            return {
                category: category,
                product: products && products.length > 0 ? products[0] : null
            };
        });
        
        const categoryData = await Promise.all(categoryPromises);
        
        console.log('Categories loaded:', categoryData); // Debug log
        
        const topCategoriesDiv = document.querySelector('.top-categories-products');
        if (topCategoriesDiv && categoryData) {
            topCategoriesDiv.innerHTML = categoryData.map(item => {
                if (!item) return '';
                
                const { category, product } = item;
                
                // Set category images based on category name
                let categoryImage = '';
                let categoryLink = '#';
                
                if (category === 'Cat Accessories') {
                    categoryImage = './product images/pets soft toys.png';
                    categoryLink = '../Collection/Cat/cataccessories.html';
                } else if (category === 'Cat Food') {
                    categoryImage = './product images/carrot dog food.png';
                    categoryLink = '../Collection/Cat/catfood.html';
                } else if (category === 'Dog Accessories') {
                    categoryImage = './product images/dog bowl.jpg';
                    categoryLink = '../Collection/Dog/dogaccessories.html';
                } else if (category === 'Dog Food') {
                    categoryImage = './product images/dry dog food chicken.jpg';
                    categoryLink = '../Collection/Dog/dogfood.html';
                }
                
                // If we have a product, use its image
                if (product && product.image_url) {
                    let productImage = product.image_url;
                    if (!productImage.startsWith('./') && !productImage.startsWith('http')) {
                        productImage = './product images/' + productImage;
                    }
                    categoryImage = productImage;
                }
                
                // Count products in this category (we can do this with a separate query if needed)
                // For now, we'll just show the category
                
                console.log('Category:', category, 'Image:', categoryImage);
                
                return `
                    <div class="top-categories-product">
                        <a href="${categoryLink}">
                            <div class="top-categories-products-image">
                                <img class="top-categories-product-image" src="${categoryImage}" alt="${category}">
                            </div>
                            <div class="top-product-text-div">
                                <p class="product-text-titles">${category}</p>
                            </div>
                        </a>
                    </div>
                `;
            }).join('');
        } else {
            topCategoriesDiv.innerHTML = '<p style="text-align: center; width: 100%; padding: 2rem;">No categories found.</p>';
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Helper function to get category images
function getCategoryImage(category) {
    const categoryImages = {
        'Pets Food Bowl': './product images/pets food bowl.png',
        'Pets Soft Toys': './product images/pets soft toys.png',
        'Bedding & Litter': './product images/bedding & litter.png',
        'Pet Backpack': './product images/pet backpack.png',
        'Dog Food': './product images/carrot dog food.png',
        'Cat Food': './product images/carrot dog food.png',
        'Pet Tent House': './product images/pets tent house.png',
        'Accessories': './product images/pets soft toys.png',
        'Toys': './product images/pets soft toys.png',
        'Food': './product images/carrot dog food.png'
    };
    
    return categoryImages[category] || './product images/placeholder.png';
}

// Add to cart functionality
document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('best-product-addtocart')) {
        e.preventDefault();
        const productDiv = e.target.closest('.best-product-flexbox');
        const productLink = productDiv.closest('a');
        const productId = new URLSearchParams(productLink.href.split('?')[1]).get('id');
        
        // Get user from session/localStorage
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (!user) {
            alert('Please login to add items to cart');
            window.location.href = '../Authentication/login.html';
            return;
        }
        
        try {
            // Add to cart (assuming you have a cart table)
            const { data, error } = await supabaseClient
                .from('cart')
                .insert({
                    user_id: user.id,
                    product_id: productId,
                    quantity: 1
                });
            
            if (error) throw error;
            
            alert('Product added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart');
        }
    }
});

