// --- Lógica del Carrito (SessionStorage) --- // R4iv1d 151225

// Abrir/Cerrar Sidebar - R4iv1d 151225
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');

    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('cart-open');
    } else {
        renderCartUI(); // Actualizar antes de abrir
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('cart-open');
    }
}

// Renderizar UI del Sidebar y Badge - R4iv1d 151225
function renderCartUI() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    const badge = document.getElementById('cart-badge');

    // Actualizar Badge en todos los iconos (flotante y si hubiera en header) - R4iv1d 151225
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    // Hay dos badges posibles: el del icono flotante y quizas otro. Usamos querySelectorAll si fuera necesario, pero por ahora ID.
    if (badge) badge.innerText = count;

    if (!container) return; // Si no estamos en una página con sidebar (raro)

    if (cart.length === 0) {
        container.innerHTML = `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#888;">
                                <i class="uil uil-shopping-cart" style="font-size:48px;"></i>
                                <p>Tu carrito está vacío</p>
                                <button onclick="toggleCart()" style="margin-top:10px; border:1px solid #ddd; background:white; padding:5px 10px; border-radius:4px; cursor:pointer;">Seguir comprando</button>
                               </div>`;
        totalEl.innerText = "S/0.00";
        return;
    }

    let html = "";
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        // Buscar imagen del producto para mostrarla (opcional, si tenemos productsData cargado)
        // productsData es global desde productos.js
        const productInfo = (typeof productsData !== 'undefined') ? productsData.find(p => p.id === item.id) : null;
        const img = productInfo ? productInfo.imagen : "inicio/media/iconoElectro.png"; // Fallback

        html += `
        <div class="cart-item">
            <img src="${img}" alt="${item.nombre}">
            <div class="cart-item-details">
                <span class="cart-item-title">${item.nombre}</span>
                <span class="cart-item-price">S/${item.price.toFixed(2)}</span>
                <div class="cart-controls">
                    <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
                    <button onclick="updateCartQty(${item.id}, -1000)" style="margin-left:auto; color:#a12332; border:none; background:none; cursor:pointer; font-size:18px;"><i class="uil uil-trash"></i></button>
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;
    totalEl.innerText = `S/${total.toFixed(2)}`;
}



function addToCart(productId, qty = 1, fromChat = false) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    // productsData es global desde productos.js
    const product = (typeof productsData !== 'undefined') ? productsData.find(p => p.id === productId) : null;

    if (product) {
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.qty += qty;
        } else {
            const finalPrice = product.promocion ? product.precioPromocion : product.precio;
            cart.push({ id: productId, nombre: product.nombre, price: finalPrice, qty: qty });
        }
        sessionStorage.setItem('cart', JSON.stringify(cart));

        if (fromChat) {
            let msg = `✅ Agregado <b>${qty}x ${product.nombre}</b> al carrito.`;
            if (qty > 1) msg += "<br>¡Excelente elección!";
            if (typeof addMessage === 'function') addMessage("ElectroBot", msg, "bot", true);
        }

        renderCartUI(); // Actualizar UI Sidebar y Badge
    }
}

function updateCartQty(productId, change) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === productId);

    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            // Eliminar si llega a 0
            cart = cart.filter(i => i.id !== productId);
        }
        sessionStorage.setItem('cart', JSON.stringify(cart));

        // Actualizar solo la UI visual, sin enviar mensaje al chat
        renderCartUI();
    }
}

// --- Funciones para Tarjetas de Productos (HTML) --- // R4iv1d 151225

function changeCardQty(id, change) {
    const span = document.getElementById(`qty-${id}`);
    if (span) {
        let val = parseInt(span.innerText);
        val += change;
        if (val < 1) val = 1;
        span.innerText = val;
    }
}

function addToCartFromCard(id) {
    const span = document.getElementById(`qty-${id}`);
    const qty = span ? parseInt(span.innerText) : 1;
    addToCart(id, qty);
    // Reset visual a 1
    if (span) span.innerText = 1;
}

function getCartHtml() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    if (cart.length === 0) return "Tu carrito está vacío 🛒.";

    let html = `<b>🛒 Tu Carrito:</b><br>
    <div style="overflow-x:auto; margin-top:5px;">
        <table style="width:100%; font-size:12px; border-collapse:collapse;">
            <tr style="background:#f0f0f0;">
                <th style="text-align:left; padding:4px;">Prod</th>
                <th style="padding:4px;">Cant.</th>
                <th style="padding:4px;">Subtotal</th>
            </tr>`;

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        html += `
            <tr style="border-bottom:1px solid #eee;">
                <td style="padding:4px;">${item.nombre}</td>
                <td style="padding:4px; text-align:center;">
                    <button onclick="updateCartQty(${item.id}, -1)" style="background:#ddd; border:none; border-radius:3px; cursor:pointer; width:20px;">-</button>
                    <span style="margin:0 5px;">${item.qty}</span>
                    <button onclick="updateCartQty(${item.id}, 1)" style="background:#ddd; border:none; border-radius:3px; cursor:pointer; width:20px;">+</button>
                </td>
                <td style="padding:4px; text-align:right;">S/${subtotal.toFixed(2)}</td>
            </tr>`;
    });
    html += `
        </table>
    </div>
    <div style="text-align:right; margin-top:5px; font-weight:bold; font-size:14px;">Total: S/${total.toFixed(2)}</div>
    <div style="text-align:center; margin-top:10px;">
        <button onclick="toggleCart(); toggleChat();" style="background:#005bbb; color:white; border:none; padding:5px 15px; border-radius:5px; cursor:pointer;">Ir al Carrito</button>
    </div>`;

    return html;
}
