const ol = () => document.querySelector('.cart__items');
const allLis = () => document.querySelectorAll('li');
const totalPrice = () => document.querySelector('.total-price');
let totalCount = 0;

function createProductImageElement(imageSource) {
const img = document.createElement('img');
img.className = 'item__image';
img.src = imageSource;
return img;
}
const saveCart = async () => {
  localStorage.setItem('productList', ol().innerHTML);
  localStorage.setItem('price', totalPrice().innerHTML);
  localStorage.setItem('totalCount', JSON.stringify(totalCount)); 
};

async function sumPrices(price) {
 totalCount += price;
 totalPrice().innerHTML = `Total: $${(Number.parseFloat(totalCount).toFixed(2))}`; 
 saveCart();
}

async function subPrice(li) {
      totalCount -= Number.parseFloat(li);
      if (totalCount < 0) {
        totalCount = 0;
      }
      totalPrice().innerHTML = `Total: $${(Number.parseFloat(totalCount).toFixed(2))}`; 
      saveCart();
}

function clearCart() {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
   allLis().forEach((li) => {
     subPrice(li.id);
     li.parentNode.removeChild(li);
   });
   saveCart();
  }); 
}

function cartItemClickListener(event) {
 subPrice(event.target.id);
 totalPrice().innerHTML = `Total: $${(Number.parseFloat(totalCount).toFixed(2))}`; 
 event.target.parentNode.removeChild(event.target);
 saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
const li = document.createElement('li');
li.className = 'cart__item';
li.id = `${salePrice}`;
li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
 li.addEventListener('click', cartItemClickListener);
ol().appendChild(li);
sumPrices(salePrice);
saveCart();
return li;
}

function createCustomElement(element, className, innerText) {
const e = document.createElement(element);
e.className = className;
e.innerText = innerText;
if (e.className === 'item__add') {
  e.addEventListener('click', (event) => {
    // Rever esse if abaixo. PARA QUE  ISSO ???? kkkkkkkkk
    let idProduct;
    if (event.target.parentNode.className === 'item') {
      idProduct = event.target.parentNode.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${idProduct}`)
      .then((product) => product.json())
      .then((p) => createCartItemElement({ sku: p.id, name: p.title, salePrice: p.price }));
    }
  });
}
return e;
}

function createProductItemElement({ sku, name, image }) {
const section = document.createElement('section');
const menu = document.querySelector('.items');
menu.appendChild(section);
section.className = 'item';

section.appendChild(createCustomElement('span', 'item__sku', sku));
section.appendChild(createCustomElement('span', 'item__title', name));
section.appendChild(createProductImageElement(image));
section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

return section;
}

function newElementFromApi(resultApi) {
const result = resultApi.results.reduce((acc, cur) => {
acc.push({ sku: cur.id, name: cur.title, image: cur.thumbnail });
return acc;
}, []);
return result;
}

function getSavedCart() {
  ol().innerHTML = (localStorage.getItem('productList'));
  totalCount = JSON.parse(localStorage.getItem('totalCount'));
  totalPrice().innerHTML = (localStorage.getItem('price'));
  allLis().forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
}

  function hideLoading() {
    const loading = document.querySelector('.loading');
    setTimeout(() => loading.parentNode.removeChild(loading), 1000);
  }
  
window.onload = () => {  
   getSavedCart();
   clearCart();
  async function getInfoApi() {
   hideLoading();
    setTimeout(() => fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((fetchPromise) => fetchPromise.json())
    .then((product) => newElementFromApi(product))
    .then((product) => product.forEach((item) => createProductItemElement(item))), 1100);
}
getInfoApi(); 
};
