const searchInput = document.querySelector('#search');
const products = Array.from(document.querySelectorAll('.product'));
const details = document.querySelector('#details');

function applyFilter() {
  const query = searchInput.value.trim().toLowerCase();
  products.forEach((product) => {
    const name = product.dataset.name;
    product.hidden = Boolean(query) && !name.includes(query);
  });
}

searchInput.addEventListener('input', applyFilter);
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    applyFilter();
  }
});

products.forEach((product) => {
  product.querySelector('button').addEventListener('click', (event) => {
    const { product: productName, price } = event.currentTarget.dataset;
    details.innerHTML = `
      <h2>${productName}</h2>
      <p>${price}</p>
      <button type="button">Add to cart</button>
    `;
  });
});

