import { renderLoading, 
  renderNotFound, 
  renderServerError, 
  renderBadData, 
  renderUnknownError } from "./ui.js";
import { HTTPError, InvalidDataError } from "./errors.js";

class Product {
  constructor({id, title, description, category, price, discountPercentage, rating, stock, tags, brand, sku, weight, dimensions,
    warrantyInformation, shippingInformation, availabilityStatus, reviews, returnPolicy, minimumOrderQuantity, meta,  images, thumbnail
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = Number(price);
    this.discountPercentage = Number(discountPercentage);
    this.rating = Number(rating);
    this.stock = Number(stock);
    this.tags = tags;
    this.brand = brand;
    this.sku = sku;
    this.weight = weight;
    this.dimensions = dimensions;
    this.warrantyInformation = warrantyInformation;
    this.shippingInformation = shippingInformation;
    this.availabilityStatus = availabilityStatus;
    this.reviews = reviews;
    this.returnPolicy = returnPolicy;
    this.minimumOrderQuantity = minimumOrderQuantity;
    this.meta = meta;
    this.images = images;
    this.thumbnail = thumbnail;
  }
}

// TODO manages state and returns current matching products
class ProductManager {
  constructor(data) {
    this.products = data.products.map(product => new Product(product));    
  }
  getProducts() {
    return [...this.products];
  }
  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      return;
    }
    return product;
  }
}

// TODO handles generating all currently viewable product cards
class ProductListUI {
  constructor(productManager) {
    this.manager = productManager;
    this.element = this.renderProductList();
    this.handleListClick = this.handleListClick.bind(this);

    this.element.addEventListener('click', this.handleListClick);
  }
  handleListClick(e) {
    let productListing = e.target.closest('.product-listing');
    if (!productListing) {
      return;
    }
    const product = this.manager.getProductById(Number(productListing.dataset.id));
    if (!product) {
      return;
    }
    new ProductDetailsUI(product);
  }
  renderProductList(filterBy, sortBy) {
    let ul = document.createElement('ul');
    ul.classList.add('product-list');
    this.matchingResults = 0;
    this.manager.getProducts().forEach(product => {
      let li = new ProductUI(product);
      ul.appendChild(li.element);
    });
    
    return ul;
  }
}
// TODO handles displaying individual product card
class ProductUI {
  constructor(product) {
    this.product = product;
    this.element = this.renderProduct();
  }
  renderProduct() {
    let li = document.createElement('li');
    li.classList.add('product-listing');
    li.dataset.id = this.product.id;

    let thumbnail = document.createElement('img');
    thumbnail.src = this.product.thumbnail;
    li.appendChild(thumbnail);

    let priceDiv = document.createElement('div');
    priceDiv.classList.add('price-container');

    let discount = document.createElement('p');
    discount.textContent = `$${(this.product.price * (1 - (this.product.discountPercentage / 100))).toFixed(2)}`;
    discount.classList.add('discount-price');
    priceDiv.appendChild(discount);

    let price = document.createElement('p')
    price.innerHTML = `List: $<span>${this.product.price}</span>`;
    price.classList.add('list-price');
    priceDiv.appendChild(price);

    li.appendChild(priceDiv);

    let title = document.createElement('p');
    title.textContent = this.product.title;
    title.classList.add('title');
    li.appendChild(title);
    return li;
  }
}
//TODO handles displaying detailed view of product
class ProductDetailsUI {
  constructor(product) {
    this.product = product
    this.element = this.renderProductDetails();
  }
  renderProductDetails() {
    let overlay = document.querySelector('.overlay');
    overlay.classList.toggle('hidden');

    let productDetails = document.createElement('div');
    overlay.appendChild(productDetails);
  }
}

async function fetchProducts() {
  let response = await fetch('https://dummyjson.com/products');
  if (!response.ok) {
    if (response.status === 404) {
      throw new HTTPError(404, 'The requested resource was not found.');
    } else if (response.status === 500) {
      throw new HTTPError(500, 'Internal Server Error. Please try again later.');
    } else {
      throw new HTTPError(response.status, 'An unexpected network error occurred.');
    }
  }
  return response.json();
}

function validateData(data) {
  if (!Object.hasOwn(data, 'products')) {
    throw new InvalidDataError('Invalid data: No products array');
  } else if (!Array.isArray(data.products)) {
    throw new InvalidDataError('Invalid data: Products is not an array');
  }
  data.products.forEach(record => {
    if (typeof record !== 'object' || record === null) {
      throw new InvalidDataError('Invalid data: non object in products');
    }
    if (!Object.hasOwn(record, 'id') || typeof record.id !== 'number') {
      throw new InvalidDataError('Invalid data: product has no id');
    }
  });
}

async function main() {
  let contentWindowElement = document.getElementById('contentWindow');
  contentWindowElement.appendChild(renderLoading());

  try {
    let data = await fetchProducts();
    validateData(data);
    
    let productManager = new ProductManager(data);    
    let productListUI = new ProductListUI(productManager);
    contentWindowElement.replaceChild(productListUI.element, contentWindowElement.firstElementChild);
    
  } catch (error) {
    if (error instanceof HTTPError) {
      if (error.status === 404) {
        contentWindowElement.replaceChild(renderNotFound(), contentWindowElement.firstElementChild);
      } else {
        contentWindowElement.replaceChild(renderServerError(error.status), contentWindowElement.firstElementChild);
      }
    }  else if (error instanceof InvalidDataError) {
      contentWindowElement.replaceChild(renderBadData(), contentWindowElement.firstElementChild);
    } else {
      console.error(error);
      contentWindowElement.replaceChild(renderUnknownError(), contentWindowElement.firstElementChild);
    }
  }
}

document.addEventListener("DOMContentLoaded", main);