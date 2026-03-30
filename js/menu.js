const menu = document.querySelector('.menu');
const btn = menu.querySelector('.nav-tgl');

btn.addEventListener('click', () => {
  menu.classList.toggle('active');
});
