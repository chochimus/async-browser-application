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

async function main() {

}

document.addEventListener("DOMContentLoaded", main);