(() => {
  const PRODUCTS_KEY = 'my_products_v1';
  const CART_KEY = 'my_cart_v1';

  const defaultProducts = [
    { id: genId(), name: 'Apply', price: 12.00, img: 'https://static.libertyprim.com/files/familles/pomme-large.jpg?1569271834' },
    { id: genId(), name: 'Apply', price: 12.00, img: 'https://static.libertyprim.com/files/familles/pomme-large.jpg?1569271834' },
    { id: genId(), name: 'Oranges', price: 25.00, img: 'https://www.lovefoodhatewaste.com/sites/default/files/styles/twitter_card_image/public/2022-07/Citrus%20fruits.jpg.webp?itok=H1j9CCCS' },
    { id: genId(), name: 'Bananas', price: 20.50, img: 'https://www.bobtailfruit.co.uk/media/mageplaza/blog/post/4/2/42e9as7nataai4a6jcufwg.jpeg' },
    { id: genId(), name: 'Apply', price: 12.00, img: 'https://static.libertyprim.com/files/familles/pomme-large.jpg?1569271834' }

  ];

  function genId() {
    return 'p_' + Date.now().toString(36) + Math.floor(Math.random()*1000).toString(36);
  }

  function readProducts() {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
      return defaultProducts.slice();
    }
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
      return defaultProducts.slice();
    }
  }

  function writeProducts(arr) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(arr));
  }

  function readCart() {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function writeCart(arr) {
    localStorage.setItem(CART_KEY, JSON.stringify(arr));
    updateCartCount();
  }

  function updateCartCount() {
    const span = document.getElementById('cart-count');
    if (span) {
      const count = readCart().reduce((s, it) => s + (it.qty || 1), 0);
      span.textContent = count;
    }
  }

  // Render products
  function renderProducts() {
    const container = document.getElementById('products-row');
    if (!container) return;
    container.innerHTML = '';
    const products = readProducts();
    if (!products.length) {
      container.innerHTML = '<div class="col-12"><p class="text-muted">No products available.</p></div>';
      return;
    }

    products.forEach(prod => {
      const col = document.createElement('div');
      col.className = 'col-sm-6 col-md-4';

      const card = document.createElement('div');
      card.className = 'card h-100 shadow-sm';

      const img = document.createElement('img');
      img.src = prod.img || 'https://via.placeholder.com/300x200?text=No+Image';
      img.alt = prod.name;
      img.className = 'card-img-top';
      img.style.objectFit = 'cover';
      img.style.height = '200px';

      const body = document.createElement('div');
      body.className = 'card-body d-flex flex-column';

      const title = document.createElement('h5');
      title.className = 'card-title  mb-4';
      title.textContent = prod.name;

      const price = document.createElement('p');
      price.className = 'price fw-bold mb-3';
      price.textContent = prod.price.toFixed(2) + '$';

      const btnGroup = document.createElement('div');
      btnGroup.className = 'mt-auto d-flex gap-2';

      const addBtn = document.createElement('card');
      addBtn.className = 'add-btn btn-sm btn-primary flex-fill';
      addBtn.textContent = 'Add to Cart';
      addBtn.addEventListener('click', () => {
        addToCart(prod.id);
        Swal.fire({
          icon: 'success',
          title: 'Added',
          text: `${prod.name} has been added to the cart.`,
          timer: 1400,
          showConfirmButton: false
        });
      });

      const removeBtn = document.createElement('button');
      removeBtn.className = 'btn btn-sm btn-outline-danger flex-fill';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        Swal.fire({
          title: 'Are you sure?',
          text:`"${prod.name}" will be permanently deleted.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then(result => {
          if (result.isConfirmed) {
            removeProduct(prod.id);
            Swal.fire({ title: 'Deleted', icon: 'success', timer: 1000, showConfirmButton: false });
          }
        });
      });

      btnGroup.appendChild(addBtn);
      btnGroup.appendChild(removeBtn);

      body.appendChild(title);
      body.appendChild(price);
      body.appendChild(btnGroup);

      card.appendChild(img);
      card.appendChild(body);
      col.appendChild(card);
      container.appendChild(col);
    });
  }

  function addToCart(productId) {
    const prod = readProducts().find(p => p.id === productId);
    if (!prod) return;
    const cart = readCart();
    const existing = cart.find(i => i.id === productId);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ id: prod.id, name: prod.name, price: prod.price, img: prod.img, qty: 1 });
    }
    writeCart(cart);
  }

  function removeProduct(productId) {
    const products = readProducts().filter(p => p.id !== productId);
    writeProducts(products);
    renderProducts();
  }

  // Add new product (with image upload)
  function setupAddProductForm() {
    const form = document.getElementById('product-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('p-name');
      const priceInput = document.getElementById('p-price');
      const imgInput = document.getElementById('p-img');

      let valid = true;

      if (!nameInput.value.trim()) {
        nameInput.classList.add('is-invalid');
        valid = false;
      } else {
        nameInput.classList.remove('is-invalid');
      }

      const priceVal = parseFloat(priceInput.value);
      if (isNaN(priceVal) || priceVal < 0) {
        priceInput.classList.add('is-invalid');
        valid = false;
      } else {
        priceInput.classList.remove('is-invalid');
      }

      if (!imgInput.files.length) {
        imgInput.classList.add('is-invalid');
        valid = false;
      } else {
        imgInput.classList.remove('is-invalid');
      }

      if (!valid) return;

      const reader = new FileReader();
      reader.onload = () => {
        const prod = {
          id: genId(),
          name: nameInput.value.trim(),
          price: Number(priceVal.toFixed(2)),
          img: reader.result  // Base64 image
        };

        const products = readProducts();
        products.push(prod);
        writeProducts(products);

        Swal.fire({
          icon: 'success',
          title: 'Added',
          text:`"${prod.name}" has been added to products.`,
          timer: 1500,
          showConfirmButton: false
        });

        form.reset();

        setTimeout(() => {
          if (document.getElementById('products-row')) {
            renderProducts();
          }
        }, 200);
      };

      reader.readAsDataURL(imgInput.files[0]);
    });
  }

  // Render cart
  function renderCart() {
    const area = document.getElementById('cart-area');
    if (!area) return;
    const cart = readCart();
    area.innerHTML = '';

    if (!cart.length) {
      area.innerHTML = '<p class="text-muted">Cart is empty.</p>';
      updateTotal();
      return;
    }

    const list = document.createElement('div');
    list.className = 'list-group';

    cart.forEach(item => {
      const el = document.createElement('div');
      el.className = 'list-group-item d-flex align-items-center';

      const img = document.createElement('img');
      img.src = item.img || 'https://via.placeholder.com/100x70?text=No+Image';
      img.alt = item.name;
      img.style.width = '100px';
      img.style.height = '70px';
      img.style.objectFit = 'cover';
      img.className = 'me-3 rounded';

      const info = document.createElement('div');
      info.className = 'flex-grow-1';
      info.innerHTML = `<h6 class="mb-1">${escapeHtml(item.name)}</h6>
                        <small>Price: ${Number(item.price).toFixed(2)} × ${item.qty || 1} = ${(Number(item.price) * (item.qty || 1)).toFixed(2)} $</small>`;

      const controls = document.createElement('div');
      controls.className = 'd-flex flex-column gap-2';

      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-sm btn-outline-danger';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        Swal.fire({
          title: 'Remove this item from the cart?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel'
        }).then(res => {
          if (res.isConfirmed) {
            removeFromCart(item.id);
            Swal.fire({ icon: 'success', title: 'Deleted', timer: 1000, showConfirmButton: false });
          }
        });
      });

      controls.appendChild(delBtn);

      el.appendChild(img);
      el.appendChild(info);
      el.appendChild(controls);

      list.appendChild(el);
    });

    area.appendChild(list);
    updateTotal();
  }

  function escapeHtml(s) {
    return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

  function updateTotal() {
    const totalSpan = document.getElementById('cart-total');
    if (!totalSpan) return;
    const cart = readCart();
    const total = cart.reduce((sum, it) => sum + (Number(it.price) * (it.qty || 1)), 0);
    totalSpan.textContent = total.toFixed(2);
  }

  function removeFromCart(productId) {
    const cart = readCart().filter(i => i.id !== productId);
    writeCart(cart);
    renderCart();
  }

  function setupClearCartBtn() {
    const btn = document.getElementById('clear-cart');
    if (!btn) return;
    btn.addEventListener('click', () => {
      Swal.fire({
        title: 'Clear the cart?',
        text: 'All items will be removed from the cart.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, clear it',
        cancelButtonText: 'Cancel'
      }).then(res => {
        if (res.isConfirmed) {
          writeCart([]);
          renderCart();
          Swal.fire({ icon: 'success', title: 'Cart cleared', timer: 1000, showConfirmButton: false });
        }
      });
    });
  }

  function setupResetSampleBtn() {
    const btn = document.getElementById('reset-sample');
    if (!btn) return;
    btn.addEventListener('click', () => {
      Swal.fire({
        title: 'Reset default products?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then(res => {
        if (res.isConfirmed) {
          localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
          renderProducts();
          Swal.fire({ icon: 'success', title: 'Reset done', timer: 900, showConfirmButton: false });
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    if (document.getElementById('products-row')) {
      renderProducts();
      setupResetSampleBtn();
    }

    if (document.getElementById('product-form')) {
      setupAddProductForm();
    }

    if (document.getElementById('cart-area')) {
      renderCart();
      setupClearCartBtn();
    }

    setInterval(updateCartCount, 1000);
  });

})();