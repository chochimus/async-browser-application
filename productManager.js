import { Product } from "./product.js";

export class ProductManager {
  constructor(data) {
    this.products = data.products.map(product => new Product(product));    
  }
  getProducts() {
    return [...this.products];
  }
  getCategories() {
    return new Set(this.products.map(product => product.category));
  }
  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      return;
    }
    return product;
  }
}