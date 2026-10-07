import { renderLoading, 
  renderNotFound, 
  renderServerError, 
  renderBadData, 
  renderUnknownError } from "./ui.js";

class Product {
  constructor({id, title, description, category, price, discountPercentage, rating, stock, tags, brand, sku, weight, dimensions,
    warrantyInformation, shippingInformation, availabilityStatus, reviews, returnPolicy, minimumOrderQuantity, meta,  images, thumbnails
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
    this.thumbnails = thumbnails;
  }
}

// TODO manages state and returns current matching products
class ProductManager {
  constructor() {
    
  }
}

// TODO handles generating all currently viewable product cards
class ProductListUI {
  constructor() {
    
  }
}
// TODO handles displaying individual product card
class ProductUI {
  constructor() {
    
  }
}
//TODO handles displaying detailed view of product
class ProductDetailsUI {
  constructor() {

  }
}

class HTTPError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

class InvalidDataError extends Error {
  constructor(message) {
    super(message);
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
      contentWindowElement.replaceChild(renderUnknownError(), contentWindowElement.firstElementChild);
    }
  }
}

document.addEventListener("DOMContentLoaded", main);