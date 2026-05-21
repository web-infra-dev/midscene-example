const form = document.querySelector('#support-form');
const confirmation = document.querySelector('#confirmation');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  confirmation.hidden = false;
  confirmation.textContent = `Request received for ${data.get('name')} on order ${data.get('order')}.`;
});

