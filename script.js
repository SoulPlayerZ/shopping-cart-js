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
  totalPrice().innerHTML = `Total Price: $ ${(Number.parseFloat(totalCount).toFixed(2))}`; 
  saveCart();
}

async function subPrice(li) {
  totalCount -= Number.parseFloat(li);
  if ((totalCount <= 0) || (totalCount === null)) {
    totalCount = 0;
  }
  totalPrice().innerHTML = `Total Price: $ ${(Number.parseFloat(totalCount).toFixed(2))}`; 
  saveCart();
}

function clearCart() {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.style.cursor = 'pointer';
  clearBtn.addEventListener('click', () => {
   allLis().forEach((li) => {
     subPrice(li.id);
     li.parentNode.removeChild(li);
   });
   saveCart();
  }); 
}

function cartItemClickListener(event) {

if(event.target.className === 'cart__item'){
  subPrice(event.target.id);
  totalPrice().innerHTML = `Total Price: $ ${(Number.parseFloat(totalCount).toFixed(2))}`; 
  event.target.parentNode.removeChild(event.target);
  saveCart();
}else if((event.target.className === 'cart__price') && (event.target.parentNode.className === 'cart__item')){
  subPrice(event.target.innerText);
  event.target.parentNode.remove();
  saveCart();
}
saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const price = document.createElement('span');
  price.className = 'cart__price';
  price.style.fontWeight = 'bold';
  price.style.fontSize = '16px'
  price.innerText = salePrice.toFixed(2);
  li.className = 'cart__item';
  li.id = `${salePrice}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $ `;
  li.appendChild(price);
  li.style.margin = '0px 20px 30px';
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
  if(e.className === 'item__price') {
    e.innerText = `Price $${innerText}`;
  }
  if (e.className === 'item__add') {
    e.style.padding = '10px';
    e.style.color = 'white';
    e.addEventListener('mouseover', (event) => {
      event.target.style.backgroundColor = 'rgb(95, 167, 95)';
      event.target.addEventListener('mouseleave', (event) => {
        event.target.style.backgroundColor = 'rgb(0, 110, 0)';
      })
    })
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

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  const menu = document.querySelector('.items');
  menu.appendChild(section);
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__price', price.toFixed(2)));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function newElementFromApi(resultApi) {
  const result = resultApi.results.reduce((acc, cur) => {
    acc.push({ sku: cur.id, name: cur.title, image: cur.thumbnail, price: cur.price });
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
  setTimeout(() => loading.style.display = 'none', 1999);
}

function showLoading() {
  const loading = document.querySelector('.loading');
  loading.style.display = 'flex';
}

function showFailMessage() {
  const container = document.querySelector('.loading');
  const failImg = document.createElement('.fail-img');
  const failText = document.createElement('.fail-text');
  failImg.src ='chop-fail-text.png';
  failImg.style.width = '420px'
  failText.src = 'chop-fail.png'
  failText.style.bottom = '120px'
  container.appendChild(failImg);
  container.appendChild(failText); 
}

function showError() {
  const error = document.querySelector('.error');
  error.style.display = 'flex';
}
 
function hideError() {
  const error = document.querySelector('.error');
  error.style.display = 'none';
}

function inputSearch() {
  const input = document.querySelector('input');  
  const items = document.querySelectorAll('.item');
  items.forEach((item) => item.parentNode.removeChild(item));
  hideError();
  showLoading();
  hideLoading();
  setTimeout(() => fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${input.value}`)
   .then((fetchPromise) => fetchPromise.json())
   .then((result) => {
    if(result.results.length === 0) {
      showError();
    }else {
      newElementFromApi(result).forEach((item) => createProductItemElement(item));
    }})
   .catch((err)=> showError(err)),  2000);  
}
 
window.onload = () => {  
  const searchBtn = document.querySelector('.search');
  const input = document.querySelector('input');
  input.addEventListener('change', inputSearch);
  searchBtn.addEventListener('click', inputSearch);
  cheet('s a g e', () => {
    alert('Sage On ^^');
    const divLoading = document.querySelector('.loading');
    divLoading.style.marginTop = '50px';
    const cart = document.querySelector('.cart');
    cart.style.backgroundColor = '#00F6FF';
    const sage = document.querySelector('.sage');
    const loadingImg = document.querySelector('.chop');
    const loadingText = document.querySelector('.loading-text');
    const errorImg = document.querySelector('.error-img');
    const errorText = document.querySelector('.error-text');
    errorImg.src = 'sage-fail.png';
    errorImg.style.marginLeft = '110px';
    errorImg.style.marginBottom = '0px';
    errorImg.style.width = '220px';
    errorText.src = 'sage-fail-text.png';
    loadingText.src = 'sage-text.png';
    loadingText.style.top = '0px';
    loadingImg.src = 'sage-loading.png';
    loadingImg.style.width = '270px';
    sage.style.display = 'block';
    cheet.disable('s a g e');
  });
  getSavedCart();
  clearCart();
  async function getInfoApi() {
    hideLoading();
    setTimeout(() =>
      fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
       .then((fetchPromise) => fetchPromise.json())
       .then((product) => newElementFromApi(product))
       .then((product) => product.forEach((item) => createProductItemElement(item)))
       .catch((err)=> showError(err)), 2000)
  }
  getInfoApi(); 
};

