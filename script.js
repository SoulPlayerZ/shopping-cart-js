const ol = () => document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
const img = document.createElement('img');
img.className = 'item__image';
img.src = imageSource;
return img;
}
const saveCart = () => {
  localStorage.setItem('productList', ol().innerHTML);
};

function cartItemClickListener(event) {
 event.target.parentNode.removeChild(event.target);
 saveCart();
}
function createCartItemElement({ sku, name, salePrice }) {
const li = document.createElement('li');
li.className = 'cart__item';
li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
 li.addEventListener('click', cartItemClickListener);
ol().appendChild(li);
saveCart();
return li;
}

function createCustomElement(element, className, innerText) {
const e = document.createElement(element);
e.className = className;
e.innerText = innerText;
if (e.className === 'item__add') {
  e.addEventListener('click', (event) => {
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

// function getSkuFromProductItem(item) {
// return item.querySelector('span.item__sku').innerText;
// }

function newElementFromApi(resultApi) {
const result = resultApi.results.reduce((acc, cur) => {
acc.push({ sku: cur.id, name: cur.title, image: cur.thumbnail });
return acc;
}, []);
return result;
}
function getSavedCart() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = (localStorage.getItem('productList'));
  const allLis = document.querySelectorAll('li');
  allLis.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
 }
window.onload = () => { 
   getSavedCart();
  function getInfoApi() {
   fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
   .then((fetchPromise) => fetchPromise.json())
   .then((product) => newElementFromApi(product))
   .then((product) => product.forEach((item) => createProductItemElement(item)));
}
getInfoApi(); 
};
