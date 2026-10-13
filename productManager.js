import { Product } from "./product.js";

export class ProductManager {
  constructor(data) {
    this.products = data.products.map(product => new Product(product));    
    this.search = '';
    this.filter = 'all';
    this.sort = 'default';
  }
  getProducts() {
    let copy = [...this.products];
    if (this.search.length !== 0) {
      this.search = this.search.toLowerCase();
      copy = copy.filter(product => product.title.toLowerCase().includes(this.search));
    }
    if (this.filter !== 'all') {
      copy = copy.filter(product => product.category.toLowerCase() === this.filter);
    }
    if (this.sort !== 'default') {
      this.sortBy(copy);
    }
    return copy;
  }
  sortBy(copy) {
    let [filter, order] = this.sort.split(' ');
    if (order === 'asc') {
      copy.sort((a, b) => a[filter] - b[filter]);
    } else if (order === 'desc') {
      copy.sort((a, b) => b[filter] - a[filter]);
    } 
    
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