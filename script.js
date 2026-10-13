import { renderLoading, 
  renderNotFound, 
  renderServerError, 
  renderBadData, 
  renderUnknownError } from "./ui.js";
import { HTTPError, InvalidDataError } from "./errors.js";
import { ProductManager } from "./productManager.js";

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
  renderProductList() {
    let ul = document.createElement('ul');
    ul.classList.add('product-list');
    this.manager.getProducts().forEach(product => {
      let li = new ProductUI(product);
      ul.appendChild(li.element);
    });
    
    return ul;
  }
  refresh() {
    this.element.remove();
    this.element = this.renderProductList();
    this.element.addEventListener('click', this.handleListClick);
    let contentWindowElement = document.getElementById('contentWindow');
    console.log(contentWindowElement);
    contentWindowElement.appendChild(this.element);
  }
}
// TODO handles displaying individual product card
class ProductUI {
  constructor(product) {
    this.product = product;
    this.element = this.renderProduct();
  }
  renderProduct() {
    const li = document.createElement('li');
    li.classList.add('product-listing');
    li.dataset.id = this.product.id;

    const thumbnail = document.createElement('img');
    thumbnail.src = this.product.thumbnail;
    li.appendChild(thumbnail);

    const priceDiv = document.createElement('div');
    priceDiv.classList.add('price-container');

    const discount = document.createElement('p');
    discount.textContent = `$${this.product.price}`;
    discount.classList.add('discount-price');
    priceDiv.appendChild(discount);

    const price = document.createElement('p')
    price.innerHTML = `List: $<span>${(this.product.price / (1 - (this.product.discountPercentage / 100))).toFixed(2)}</span>`;
    price.classList.add('list-price');
    priceDiv.appendChild(price);

    li.appendChild(priceDiv);

    const title = document.createElement('p');
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
    this.renderProductDetails();
  }
  renderProductDetails() {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.addEventListener('click', (e) => {
      if (e.target !== e.currentTarget) {
        return;
      }
      overlay.remove();
    })

    const productDetails = document.createElement('div');
    productDetails.classList.add('product-details');

    const productImages = document.createElement('img');
    productImages.src = this.product.images[0];
    productDetails.appendChild(productImages);

    const contentWindow = document.createElement('div');
    contentWindow.classList.add('content-window')

    const productCategory = document.createElement('p');
    productCategory.textContent = this.product.category[0].toUpperCase() + this.product.category.slice(1);
    productCategory.classList.add('category');
    contentWindow.appendChild(productCategory);

    const productBrand = document.createElement('p');
    productBrand.textContent = this.product.brand;
    productBrand.classList.add('brand');
    contentWindow.appendChild(productBrand);

    const productTitle = document.createElement('p');
    productTitle.textContent = this.product.title;
    productTitle.classList.add('title');
    contentWindow.appendChild(productTitle);

    const productRating = document.createElement('p');
    productRating.textContent = `☆ ${this.product.rating} (${this.product.reviews.length} reviews)`;
    productRating.classList.add('rating');
    contentWindow.appendChild(productRating);

    const priceInfo = document.createElement('div');

    const productCost = document.createElement('p');
    productCost.textContent = `$${this.product.price}`;
    productCost.classList.add('price');
    priceInfo.appendChild(productCost);

    const productCostMinusDiscount = document.createElement('p');
    productCostMinusDiscount.textContent = `$${(this.product.price / (1 - (this.product.discountPercentage / 100))).toFixed(2)}`
    productCostMinusDiscount.classList.add('original-price');
    priceInfo.appendChild(productCostMinusDiscount);

    const productDiscount = document.createElement('p');
    productDiscount.textContent = `${Math.round(this.product.discountPercentage)}% off`;
    productDiscount.classList.add('discount-percentage');
    priceInfo.appendChild(productDiscount);

    contentWindow.appendChild(priceInfo);

    const productDescription = document.createElement('p');
    productDescription.textContent = this.product.description;
    contentWindow.appendChild(productDescription);
    
    productDetails.appendChild(contentWindow);
    
    overlay.appendChild(productDetails);
    document.body.appendChild(overlay);
  }
}

class SearchAndFilterUI {
  constructor(refreshCallback, productManager) {
    this.manager = productManager;
    this.refresh = refreshCallback;
    this.element = this.renderSearchAndFilter();
    this.handleChange = this.handleChange.bind(this);
    
    this.element.addEventListener('change', this.handleChange);
    this.element.addEventListener('input', this.handleChange);
  }
  handleChange(e) {
    if (e.target.id === 'search' && e.type === 'input') {
      this.manager.search = e.target.value;
    } else if (e.target.id === 'filter' && e.type === 'change') {
      this.manager.filter = e.target.value;
    } else if (e.target.id === 'sort' && e.type === 'change') {
      this.manager.sort = e.target.value;
    }
    this.refresh();
  }
  renderSearchAndFilter() {
    const search = document.querySelector('search');
    this.renderSearch(search);
    this.renderFilter(search);
    this.renderSort(search);
    return search;
  }
  renderSort(search) {
    const sortContainer = document.createElement('dl');
    
    const sortLabelWrapper = document.createElement('dt');
    const sortLabel = document.createElement('label');
    sortLabel.setAttribute('for', 'sort');
    sortLabel.textContent = 'sort by: ';
    sortLabelWrapper.appendChild(sortLabel);
    sortContainer.appendChild(sortLabelWrapper);

    const sortInputWrapper = document.createElement('dd');
    const sortInput = document.createElement('select');
    sortInput.name = 'sort';
    sortInput.id = 'sort';
    this.renderSortOptions(sortInput);
    sortInputWrapper.appendChild(sortInput);
    sortContainer.appendChild(sortInputWrapper);

    search.appendChild(sortContainer);
  }
  renderSortOptions(select) {
    let option = document.createElement('option');
    option.value = 'default';
    option.textContent = 'default';
    select.appendChild(option);

    option = document.createElement('option');
    option.value = 'price desc';
    option.textContent = 'high price';
    select.appendChild(option);

    option = document.createElement('option');
    option.value = 'price asc';
    option.textContent = 'low price';
    select.appendChild(option);

    option = document.createElement('option');
    option.value = 'rating desc';
    option.textContent = 'top rated';
    select.appendChild(option);

    option = document.createElement('option');
    option.value = 'rating asc';
    option.textContent = 'bottom rated';
    select.appendChild(option);
  }
  renderSearch(search) {
    const searchContainer = document.createElement('dl');

    const searchLabelWrapper = document.createElement('dt');
    const searchLabel = document.createElement('label');
    searchLabel.setAttribute('for', 'search');
    searchLabel.textContent = 'search: '
    searchLabelWrapper.appendChild(searchLabel);
    searchContainer.appendChild(searchLabelWrapper);

    const searchInputWrapper = document.createElement('dd');
    const searchInput = document.createElement('input');
    searchInput.id = 'search';
    searchInput.name = 'search';
    searchInput.type = 'text';
    searchInputWrapper.appendChild(searchInput);
    searchContainer.appendChild(searchInputWrapper);

    search.appendChild(searchContainer);
  }
  renderFilter(search) {
    const filterContainer = document.createElement('dl');
    
    const filterLabelWrapper = document.createElement('dt');
    const filterLabel = document.createElement('label');
    filterLabel.setAttribute('for', 'filter');
    filterLabel.textContent = 'category: ';
    filterLabelWrapper.appendChild(filterLabel);
    filterContainer.appendChild(filterLabelWrapper);

    const filterInputWrapper = document.createElement('dd');
    const filterInput = document.createElement('select');
    filterInput.name = 'filter';
    filterInput.id = 'filter';
    this.renderFilterOptions(filterInput);
    filterInputWrapper.appendChild(filterInput);
    filterContainer.appendChild(filterInputWrapper);

    search.appendChild(filterContainer);
  }
  renderFilterOptions(select) {
    let option = document.createElement('option');
    option.value = 'all';
    option.textContent = 'all';
    select.appendChild(option);

    this.manager.getCategories().forEach(category => {
      let option = document.createElement('option');
      option.value = category.toLowerCase();
      option.textContent = category;
      select.appendChild(option);
    });
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
    let searchAndFilterUI = new SearchAndFilterUI(() => productListUI.refresh(), productManager);
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