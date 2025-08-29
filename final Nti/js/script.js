// ============ حماية الصفحة ============
window.onload = function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
    window.location.href = "login.html";
  }
};

// ============ زرار تسجيل الخروج ============
function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}

// ============ Slider Logic ============
let slides = document.querySelectorAll(".slide");
let index = 0;

function showSlide() {
  slides.forEach(slide => slide.classList.remove("active"));
  slides[index].classList.add("active");
  index = (index + 1) % slides.length;
}
setInterval(showSlide, 5000);

// ============ فلترة المنتجات ============
const filterButtons = document.querySelectorAll('.filter-buttons .btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');

    productCards.forEach(card => {
      if (filter === 'all' || card.classList.contains(filter)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});