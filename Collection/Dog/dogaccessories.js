
// DOG ACCESSORIES PRODUCTS:

const dogAccessories = [
  {
    image: '/Homepage/product images/leather-chew-toy.jpg',
    imageAlt: 'Leather Chew toy image',
    hoverimage: '/Homepage/product images/leather-chew-toy-2.jpg',
    hoverimageAlt: 'Leather Chew toy image Hover',
    name: 'Pawpourri Premium Natural Suede Leather Chew Toy',
    rating: '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i>',
    price: 900
  },
  {
    image: '/Homepage/product images/dog bowl.jpg',
    imageAlt: 'Dog Bowl',
    hoverimage: '/Homepage/product images/dog bowl 2.jpg',
    imagehoverAlt: 'Dog bowl hover',
    name: 'Pets Empire Stainless Steel Dog Bowl',
    rating: '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i><i class="fa-regular fa-star"></i>',
    price: 2000
  },
  {
    image: '/Homepage/product images/cake treat.jpg',
    imageAlt: 'Cake Treat',
    hoverimage:'/Homepage/product images/cake treat 2.jpg',
    hoverimageAlt: 'Cake Treat Hover',
    name:'Dentastix Oral Care Treats For Samll Breeds Adult Dogs',
    rating:'<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>',
    price: 2100
  },
  {
    image: '/Homepage/product images/stainless steel bowl.jpg',
    imageAlt: 'Stainless Steel Bowl',
    hoverimage: '/Homepage/product images/stainless steel bowl 2.jpg',
    hoverimageAlt: 'Stainless Steel Bowl hover',
    name:'Food-Grade Melamine Base And Stainless Steel Bowl',
    rating:'<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i><i class="fa-regular fa-star"></i>',
    price: 3500
   },
  {
    image: '/Homepage/product images/soft velvet house.jpg',
    imageAlt:'Soft velvet house',
    hoverimage: '/Homepage/product images/soft velvet house 2.jpg',
    hoverimageAlt: 'Soft velvet house hover',
    name: 'Foodie Puppies Foldable Softy Velvet House',
    rating: '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-regular fa-star"></i><i class="fa-regular fa-star"></i>',
    price: 9900
  }
]









// DOM LOGIC 

let dogAccessoriesHTML = '';
dogAccessories.forEach((dogAccessories) =>
  {
     dogAccessoriesHTML += `
      <div class="product-div">
            <div class="product-image-div">
                <img class="product-image" src="${dogAccessories.image}" alt="${dogAccessories.imageAlt}">
                <img class="product-image-hover" src="${dogAccessories.hoverimage}" alt="${dogAccessories.hoverimageAlt}">
            </div>
            <div class="product-text-div">
                <p class="product-text-title">${dogAccessories.name}</p>
                <p class="product-text-rating">${dogAccessories.rating}</p>
                <p class="product-text-price"><span style="color: rgb(135, 218, 72); font-weight: bold;">
                $${(dogAccessories.price / 100).toFixed(2)}</span></p>
            </div>
    </div> 
    `;
  }
);
document.querySelector('.js-products-grid').innerHTML = dogAccessoriesHTML;