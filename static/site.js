document.addEventListener('DOMContentLoaded', () => {

    const btnCatalogToggle = document.getElementById('btnCatalogToggle');
    const catalogDropdown = document.getElementById('catalogDropdown');
    const btnSearch = document.getElementById('btnSearch');

    const btnNavOrders = document.querySelector('.nav-actions-block .nav-action-btn:nth-child(1)');
    const btnNavCart = document.querySelector('.nav-actions-block .nav-action-btn:nth-child(2)');
    const btnNavProfile = document.querySelector('.nav-actions-block .nav-action-btn:nth-child(3)');
    const btnAdminModalOpen = document.getElementById('btnAdminModalOpen');

    if (btnCatalogToggle && catalogDropdown) {
        btnCatalogToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            catalogDropdown.classList.toggle('active');
        });
        document.addEventListener('click', (event) => {
            if (!catalogDropdown.contains(event.target) && event.target !== btnCatalogToggle) {
                catalogDropdown.classList.remove('active');
            }
        });
    }

    if (btnSearch) {
        btnSearch.addEventListener('click', (e) => {
            e.preventDefault();

            const selectCategory = document.getElementById('filterCategory');
            const selectColor = document.getElementById('filterColor');
            const selectPriceRange = document.getElementById('filterPriceRange');
            const inputSearchInput = document.getElementById('searchInput');

            const chosenCategory = selectCategory ? selectCategory.value.trim().toLowerCase() : 'all';
            const chosenColor = selectColor ? selectColor.value.trim().toLowerCase() : 'all';
            const chosenPriceRange = selectPriceRange ? selectPriceRange.value.trim() : 'all';
            const textQuery = inputSearchInput ? inputSearchInput.value.toLowerCase().trim() : '';

            const cards = document.querySelectorAll('#productsGrid > div, .product-card-admin');
            let foundAny = false;

            cards.forEach(card => {
                const itemCategory = (card.getAttribute('data-category') || '').toLowerCase();
                const itemColor = (card.getAttribute('data-color') || '').toLowerCase();
                const itemPrice = parseFloat(card.getAttribute('data-price')) || 0;
                
                const cardTitle = card.querySelector('h4') ? card.querySelector('h4').textContent.toLowerCase() : '';
                const cardDesc = card.querySelector('.card-desc, p') ? card.querySelector('.card-desc, p').textContent.toLowerCase() : '';

                let matchCategory = false;
                if (chosenCategory === 'all' || chosenCategory === '') {
                    matchCategory = true;
                } else if (chosenCategory === 'кресла и стулья') {
                    matchCategory = (itemCategory.includes('кресл') || itemCategory.includes('стул') || itemCategory.includes('мебель'));
                } else {
                    const cleanChosen = chosenCategory.substring(0, 4); 
                    matchCategory = itemCategory.includes(cleanChosen);
                }

                let matchColor = false;
                if (chosenColor === 'all' || chosenColor === '') {
                    matchColor = true;
                } else {
                    const cleanColor = chosenColor.includes('дуб') ? 'дуб' : chosenColor.substring(0, 4);
                    matchColor = itemColor.includes(cleanColor);
                }

                let matchPrice = false;
                if (chosenPriceRange === 'all' || chosenPriceRange === '') {
                    matchPrice = true;
                } else if (chosenPriceRange === '0-100000') {
                    matchPrice = (itemPrice <= 100000);
                } else if (chosenPriceRange === '100000-200000') {
                    matchPrice = (itemPrice >= 100000 && itemPrice <= 200000);
                } else if (chosenPriceRange === '200000+') {
                    matchPrice = (itemPrice >= 200000);
                }

                const matchText = (textQuery === '' || cardTitle.includes(textQuery) || cardDesc.includes(textQuery));

                if (matchCategory && matchColor && matchPrice && matchText) {
                    card.style.setProperty('display', 'flex', 'important');
                    foundAny = true;
                } else {
                    card.style.setProperty('display', 'none', 'important');
                }
            });

            let noResultsMsg = document.getElementById('catalogNoResultsMessage');
            if (!foundAny) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('p');
                    noResultsMsg.id = 'catalogNoResultsMessage';
                    noResultsMsg.style.cssText = "color: #a39072; text-align: center; font-family: 'Times New Roman', serif; font-size: 20px; width: 100%; margin-top: 40px; letter-spacing: 1px; font-weight: bold;";
                    noResultsMsg.textContent = "Товары с такими параметрами в данный момент отсутствуют в коллекции салона.";
                    const grid = document.getElementById('productsGrid');
                    if (grid) grid.appendChild(noResultsMsg);
                } else {
                    noResultsMsg.style.display = 'block';
                }
            } else {
                if (noResultsMsg) noResultsMsg.style.display = 'none';
            }
        });
    }

    if (btnNavOrders) { 
        btnNavOrders.addEventListener('click', () => { 
            window.location.href = '/admin/orders'; 
        }); 
    }
    if (btnNavCart) {
        btnNavCart.addEventListener('click', () => { 
            window.location.href = '/shop/cart'; 
        });
    }
    if (btnNavProfile) {
        btnNavProfile.addEventListener('click', () => { 
            window.location.href = '/user/profile'; 
        });
    }
    
    // КНОПКА ADMIN
    if (btnAdminModalOpen) {
        btnAdminModalOpen.addEventListener('click', () => { 
            window.location.href = '/login'; 
        });
    }

    const btnGoToLogin = document.getElementById('btnGoToLogin');
    const btnGoToRegister = document.getElementById('btnGoToRegister');
    if (btnGoToLogin) btnGoToLogin.addEventListener('click', () => { window.location.href = '/user/profile/login'; });
    if (btnGoToRegister) btnGoToRegister.addEventListener('click', () => { window.location.href = '/user/profile/register'; });


    const toggleRegPasswordBtn = document.getElementById('toggleRegPassword');
    if (toggleRegPasswordBtn) {
        toggleRegPasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const input = document.getElementById('regPassword');
            if (input) {
                input.type = input.type === 'password' ? 'text' : 'password';
                this.classList.toggle('hidden-mode', input.type === 'text');
            }
        });
    }

    const toggleLogPasswordBtn = document.getElementById('toggleLogPassword');
    if (toggleLogPasswordBtn) {
        toggleLogPasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const input = document.getElementById('userLogPassword');
            if (input) {
                input.type = input.type === 'password' ? 'text' : 'password';
                this.classList.toggle('hidden-mode', input.type === 'text');
            }
        });
    }

    const togglePasswordBtn = document.getElementById('togglePassword');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const input = document.getElementById('password');
            if (input) {
                input.type = input.type === 'password' ? 'text' : 'password';
                this.classList.toggle('hidden-mode', input.type === 'text');
            }
        });
    }

    /* =========================================================================
       3. ФОРМЫ АВТОРИЗАЦИИ И РЕГИСТРАЦИИ КЛИЕНТОВ
       ========================================================================= */
    const profileLoginForm = document.getElementById('userLoginForm');
    if (profileLoginForm) {
        profileLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('userLogEmail').value.trim();
            const password = document.getElementById('userLogPassword').value;
            const errorBlock = document.getElementById('userLogErrorMessage');
            try {
                const response = await fetch('/api/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const result = await response.json();
                if (result.success) window.location.href = '/user/profile';
                else errorBlock.textContent = result.message;
            } catch (err) { errorBlock.textContent = "Ошибка входа."; }
        });
    }

    const profileRegisterForm = document.getElementById('userRegisterForm') || document.querySelector('form[action="/api/user/register"]');
    if (profileRegisterForm) {
        profileRegisterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const lastName = document.getElementById('regLastName').value.trim();
            const firstName = document.getElementById('regFirstName').value.trim();
            const middleName = document.getElementById('regMiddleName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const phone = document.getElementById('regPhone').value.trim();
            const errorBlock = document.getElementById('userRegErrorMessage');
            const successBlock = document.getElementById('userRegSuccessMessage');
            try {
                const response = await fetch('/api/user/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lastName, firstName, middleName, email, password, phone })
                });
                const result = await response.json();
                if (result.success) {
                    successBlock.textContent = result.message;
                    profileRegisterForm.reset();
                    setTimeout(() => { window.location.href = '/user/profile/login'; }, 1500);
                } else { errorBlock.textContent = result.message; }
            } catch (err) { errorBlock.textContent = "Ошибка регистрации."; }
        });
    }


    const adminLoginForm = document.getElementById('loginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const errorBlock = document.getElementById('errorMessage');
            
            if (errorBlock) {
                errorBlock.textContent = '';
                errorBlock.classList.remove('show');
            }
            
            if (!username || !password) {
                if (errorBlock) {
                    errorBlock.textContent = '⚠ Заполните все поля!';
                    errorBlock.classList.add('show');
                }
                return;
            }
            
            try {
                console.log('🔐 Отправка запроса на /api/admin/login');
                
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const result = await response.json();
                console.log('📦 Ответ сервера:', result);
                
                if (result.success) {
                    window.location.href = '/welcome/admin';
                } else {
                    if (errorBlock) {
                        errorBlock.textContent = '❌ ' + (result.message || 'Неверный логин или пароль!');
                        errorBlock.classList.add('show');
                    }
                }
            } catch (err) {
                console.error('❌ Ошибка:', err);
                if (errorBlock) {
                    errorBlock.textContent = '⚠ Ошибка соединения с сервером!';
                    errorBlock.classList.add('show');
                }
            }
        });
    }

    /* =========================================================================
       4. ЗАГРУЗКА КАТАЛОГА, КОРЗИНЫ И ЗАКАЗОВ
       ========================================================================= */
    const productsGrid = document.getElementById('productsGrid');
    const cartContainer = document.getElementById('cartDynamicContainer');
    const ordersContainer = document.getElementById('ordersContainer');

    if (productsGrid) {
        const roleInput = document.getElementById('currentUserRole');
        if (roleInput && roleInput.value === 'admin') { loadAdminCatalog(productsGrid); } 
        else { loadUserCatalog(productsGrid); }
    }
    if (cartContainer) { renderEmptyCartBox(cartContainer); }
    if (ordersContainer) { loadOrdersList(ordersContainer); }
});


async function loadUserCatalog(grid) {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        grid.innerHTML = '';
        
        if (!products || products.length === 0) {
            grid.innerHTML = '<p style="color: #a39072; text-align: center; font-family: \'Times New Roman\', serif; font-size: 18px; width: 100%;">Экспонаты в каталоге временно отсутствуют.</p>';
            return;
        }

        products.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card-admin';
            card.setAttribute('data-id', item.id);
            card.setAttribute('data-title', item.title);
            card.setAttribute('data-price', item.price);
            card.setAttribute('data-category', item.category || 'Кресла и Стулья');
            card.setAttribute('data-color', item.color || 'Орех');
            card.setAttribute('data-image', item.image);
            
            card.innerHTML = `
                <div class="card-image-container-fixed">
                    <img src="/static/uploads/${item.image}" class="product-gallery-img" alt="${item.title}">
                </div>
                <div class="card-info-block">
                    <span class="card-tag">${item.category} | ${item.color}</span>
                    <h4>${item.title}</h4>
                    <p class="card-desc">${item.description}</p>
                    <div class="card-footer-admin">
                        <span class="card-price">${item.price.toLocaleString()} ₽</span>
                        <button type="button" class="btn-buy-item">В корзину</button>
                    </div>
                </div>`;
            grid.appendChild(card);
        });
    } catch (e) { grid.innerHTML = '<p style="color: #cf5353; text-align: center; width: 100%;">Ошибка загрузки витрины мебельного дома.</p>'; }
}

async function runProductDelete(id) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    try {
        const response = await fetch(`/api/products/delete/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) { loadAdminCatalog(document.getElementById('productsGrid')); }
    } catch (e) { console.error(e); }
}

/* =========================================================================
   ВЫВОД ЗАКАЗОВ
   ========================================================================= */
async function loadOrdersList(container) {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        
        if (!orders || orders.length === 0) {
            container.innerHTML = `
                <div class="cart-empty-bordered-box" style="margin: 20px auto 0; width: 100%; max-width: 550px; text-align: center; border: 2px solid #e5cc9f; padding: 30px; background: #2b1b10;">
                    <p class="empty-msg-text" style="font-family: 'Times New Roman', serif; font-size: 20px; color: #e5cc9f; letter-spacing: 1px; margin-bottom: 25px;">Вы еще не оформили ни один заказ</p>
                    <a href="/user/catalog" class="btn-submit" style="text-decoration: none; margin: 0 auto; width: 100%; max-width: 260px; height: 48px; display: inline-flex; justify-content: center; align-items: center; background: #d4b26f; color: #1a100a; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px;">Перейти в магазин</a>
                </div>`;
            return;
        }
        
        container.innerHTML = '';
        orders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-item-card';
            card.style.width = "100%";
            card.style.background = "#2b1b10";
            card.style.border = "2px solid #e5cc9f";
            card.style.borderRadius = "4px";
            card.style.padding = "25px 30px";
            card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.5)";
            card.style.boxSizing = "border-box";
            card.style.marginBottom = "20px";
            
            card.innerHTML = `
                <div class="order-card-header" style="font-size: 24px; color: #e5cc9f; font-family: 'Times New Roman', serif; letter-spacing: 2px; border-bottom: 1px solid rgba(229, 204, 159, 0.2); padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <span>Заказ №${order.id}</span>
                </div>
                <div class="order-card-body">
                    <p style="font-size: 18px; color: #a39072; margin-bottom: 10px; line-height: 1.6;"><strong style="color: #e5cc9f; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; margin-right: 5px;">Покупатель:</strong> ${order.customer}</p>
                    <p style="font-size: 18px; color: #a39072; margin-bottom: 10px; line-height: 1.6;"><strong style="color: #e5cc9f; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; margin-right: 5px;">Адрес доставки:</strong> ${order.address}</p>
                    <p style="font-size: 18px; color: #a39072; margin-bottom: 10px; line-height: 1.6;"><strong style="color: #e5cc9f; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; margin-right: 5px;">Наличие заказа (Состав):</strong> ${order.items.join(', ')}</p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 25px; border-top: 1px solid rgba(229, 204, 159, 0.1); padding-top: 15px;">
                        <p style="font-size: 22px; color: #e5cc9f; font-weight: bold; margin: 0;"><strong style="color: #e5cc9f; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; margin-right: 5px;">Сумма:</strong> ${order.total.toLocaleString()} ₽</p>
                        <button type="button" class="btn-cancel-order" onclick="window.runOrderCancel(${order.id})">Отменить заказ</button>
                    </div>
                </div>`;
            container.appendChild(card);
        });
    } catch (e) { container.innerHTML = '<p style="color: #cf5353; text-align: center; width: 100%;">Ошибка загрузки реестра ваших заказов.</p>'; }
}

window.runOrderCancel = async function(id) {
    if (!confirm("Вы уверены, что хотите отменить этот заказ?")) return;
    try {
        const response = await fetch(`/api/orders/delete/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            alert("ЗАКАЗ УСПЕШНО ОТМЕНЕН!");
            loadOrdersList(document.getElementById('ordersContainer'));
        }
    } catch (e) { console.error("Ошибка отмены заказа:", e); }
};

/* =========================================================================
   КОРЗИНА
   ========================================================================= */
function renderEmptyCartBox(container) {
    const dynamicContainer = document.getElementById('cartDynamicContainer');
    if (!dynamicContainer) return;
    let cart = JSON.parse(localStorage.getItem('jugendstil_cart')) || [];

    if (cart.length === 0) {
        dynamicContainer.className = "cart-dynamic-layout justify-center";
        dynamicContainer.innerHTML = `
            <div class="cart-empty-bordered-box" style="margin: 0 auto; width: 100%; max-width: 550px; text-align: center;">
                <p class="empty-msg-text">Вы пока не добавили ни один товар в корзину</p>
                <a href="/user/catalog" class="btn-submit btn-go-to-shop-fixed" style="text-decoration: none;">Перейти в магазин</a>
            </div>`;
        return;
    }

    dynamicContainer.className = "cart-dynamic-layout";
    let itemsHtml = ''; let totalItems = 0; let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
        itemsHtml += `
            <div class="cart-item-row" id="cart-row-${item.id}">
                <div class="cart-item-img-box"><img src="/static/uploads/${item.image}" class="cart-product-img"></div>
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p class="cart-item-meta">${item.category} <span>|</span> ${item.color}</p>
                </div>
                <div class="cart-quantity-controls">
                    <button type="button" class="btn-qty" onclick="changeCartQty(${item.id}, -1)">-</button>
                    <span class="qty-number">${item.quantity}</span>
                    <button type="button" class="btn-qty" onclick="changeCartQty(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-price-zone">${(item.price * item.quantity).toLocaleString()} ₽</div>
                <div class="cart-action-zone">
                    <button type="button" class="btn-remove-cart" onclick="removeCartItem(${item.id})">Удалить</button>
                </div>
            </div>`;
    });

    dynamicContainer.innerHTML = `
        <div class="cart-items-column">${itemsHtml}</div>
        <div class="cart-checkout-sidebar">
            <h3 class="sidebar-title">Ваш Расчёт</h3>
            <div class="sidebar-summary-row"><span>Товары:</span><strong id="sidebar-total-qty">${totalItems} шт.</strong></div>
            <div class="sidebar-summary-row"><span>Доставка:</span><strong style="color: #62c462;">Бесплатно</strong></div>
            <div class="sidebar-total-price">
                <div style="font-size: 11px; text-transform: uppercase; color: #a39072; margin-bottom: 8px; letter-spacing: 1.5px;">Итого к оплате</div>
                <span id="sidebar-total-price">${totalPrice.toLocaleString()} ₽</span>
            </div>
            <button type="button" id="btnTriggerGoToCheckout" class="btn-submit">Оформить заказ</button>
        </div>`;
}

window.changeCartQty = function(id, count) {
    let cart = JSON.parse(localStorage.getItem('jugendstil_cart')) || [];
    let product = cart.find(p => Number(p.id) === Number(id));
    if (product) {
        product.quantity += count;
        if (product.quantity < 0) product.quantity = 0;
        localStorage.setItem('jugendstil_cart', JSON.stringify(cart));
        
        const row = document.getElementById(`cart-row-${id}`);
        if (row) {
            row.querySelector('.qty-number').textContent = product.quantity;
            row.querySelector('.cart-item-price-zone').textContent = (product.price * product.quantity).toLocaleString() + ' ₽';
        }
        let newQty = 0; let newPrice = 0;
        cart.forEach(item => { newQty += item.quantity; newPrice += item.price * item.quantity; });
        document.getElementById('sidebar-total-qty').textContent = newQty + ' шт.';
        document.getElementById('sidebar-total-price').textContent = newPrice.toLocaleString() + ' ₽';
    }
};

window.removeCartItem = function(id) {
    if (!confirm('Убрать товар из корзины?')) return;
    let cart = JSON.parse(localStorage.getItem('jugendstil_cart')) || [];
    cart = cart.filter(p => Number(p.id) !== Number(id));
    localStorage.setItem('jugendstil_cart', JSON.stringify(cart));
    renderEmptyCartBox(null);
};


document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btnTriggerGoToCheckout') {
        e.preventDefault();
        window.location.href = '/zakaz';
        return;
    }

    if (e.target && e.target.classList.contains('btn-buy-item')) {
        e.preventDefault();
        const userField = document.getElementById('currentSessionUser');
        const currentUser = userField ? userField.value.trim().toLowerCase() : 'гость';

        if (currentUser === 'гость' || currentUser === '' || currentUser === 'none') {
            window.location.href = '/user/profile';
            return;
        }

        const card = e.target.closest('.product-card-admin');
        if (!card) return;

        const id = Number(card.getAttribute('data-id'));
        const title = card.getAttribute('data-title');
        const price = Number(card.getAttribute('data-price'));
        const category = card.getAttribute('data-category');
        const color = card.getAttribute('data-color');
        const image = card.getAttribute('data-image');

        let cart = JSON.parse(localStorage.getItem('jugendstil_cart')) || [];
        let existingProduct = cart.find(p => Number(p.id) === id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ id, title, category, color, price, image, quantity: 1 });
        }

        localStorage.setItem('jugendstil_cart', JSON.stringify(cart));
        alert(`Товар «${title}» добавлен в корзину.`);
    }
});

/* =========================================================================
   ФИНАЛЬНАЯ ОТПРАВКА ЗАКАЗА
   ========================================================================= */
document.addEventListener('submit', async function(e) {
    const orderForm = document.getElementById('orderCheckoutForm');
    if (e.target === orderForm) {
        e.preventDefault();
        const address = document.getElementById('orderAddress').value.trim();
        const card = document.getElementById('cardNum').value.trim();
        const date = document.getElementById('cardDate').value.trim();
        const cvc = document.getElementById('cardCvc').value.trim();
        const errorBlock = document.getElementById('checkoutErrorMessage');

        if (!address || !card || !date || !cvc) {
            if (errorBlock) errorBlock.textContent = "Пожалуйста, заполните все обязательные поля!";
            return;
        }

        let cart = JSON.parse(localStorage.getItem('jugendstil_cart')) || [];
        if (cart.length === 0) {
            if (errorBlock) errorBlock.textContent = "Ваша корзина пуста!";
            return;
        }

        let totalPrice = 0;
        cart.forEach(item => { totalPrice += item.price * item.quantity; });

        try {
            const response = await fetch('/save-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart, total: totalPrice, address: address })
            });
            const result = await response.json();
            if (result.success) {
                alert("ВАШ ЗАКАЗ УСПЕШНО ОФОРМЛЕН!");
                localStorage.removeItem('jugendstil_cart');
                window.location.href = '/user/catalog';
            } else {
                if (errorBlock) errorBlock.textContent = result.message;
            }
        } catch (err) {
            if (errorBlock) errorBlock.textContent = "Ошибка связи с сервером.";
        }
    }
});


const btnEnterShop = document.getElementById('btnEnterShop');
const btnEnterAdminShop = document.getElementById('btnEnterAdminShop');
const welcomeCard = document.querySelector('.welcome-card');

if (btnEnterShop) {
    btnEnterShop.addEventListener('click', (e) => {
        e.preventDefault();
        if (welcomeCard) {
            welcomeCard.classList.add('fade-out-exit');
            setTimeout(() => { window.location.href = '/user/catalog'; }, 550);
        } else {
            window.location.href = '/user/catalog';
        }
    });
}

if (btnEnterAdminShop) {
    btnEnterAdminShop.addEventListener('click', (e) => {
        e.preventDefault();
        if (welcomeCard) {
            welcomeCard.classList.add('fade-out-exit');
            setTimeout(() => { window.location.href = '/admin/catalog'; }, 550);
        } else {
            window.location.href = '/admin/catalog';
        }
    });
}