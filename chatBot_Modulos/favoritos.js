// --- Lógica de Favoritos (LocalStorage) --- // R4iv1d 151225

function toggleFavorite(id, fromChat = false) {
    id = Number(id); // Asegurar que sea número
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.indexOf(id);
    // productsData es global desde productos.js
    const prod = (typeof productsData !== 'undefined') ? productsData.find(p => p.id === id) : null;

    // Buscar todos los iconos del mismo producto
    const icons = document.querySelectorAll(`.fav-icon[onclick="toggleFavorite(${id})"]`);
    // También buscar los que tengan el parámetro true en caso de ser generados dinámicamente
    const iconsChat = document.querySelectorAll(`.fav-icon[onclick="toggleFavorite(${id}, true)"]`);

    if (index === -1) {
        // Agregar
        favorites.push(id);
        const activateIcon = (icon) => {
            icon.classList.add('fav-active');
            icon.classList.remove('uil-heart');
            icon.classList.add('uis-heart');
            icon.style.color = '#ff4757';
        }
        icons.forEach(activateIcon);
        iconsChat.forEach(activateIcon);

        console.log(`Agregado a favoritos: ${id}`);
        if (prod && fromChat && typeof addMessage === 'function') {
            addMessage("ElectroBot", `❤️ Guardé <b>${prod.nombre}</b> en tus favoritos.`, "bot", true);
        }
    } else {
        // Eliminar
        favorites.splice(index, 1);
        const deactivateIcon = (icon) => {
            icon.classList.remove('fav-active');
            icon.classList.remove('uis-heart');
            icon.classList.add('uil-heart');
            icon.style.color = '#ccc';
        }
        icons.forEach(deactivateIcon);
        iconsChat.forEach(deactivateIcon);

        console.log(`Eliminado de favoritos: ${id}`);
        if (prod && fromChat && typeof addMessage === 'function') {
            addMessage("ElectroBot", `💔 Eliminé <b>${prod.nombre}</b> de tus favoritos.`, "bot", true);
        }
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(id => {
        id = Number(id);
        const icons = document.querySelectorAll(`.fav-icon[onclick="toggleFavorite(${id})"]`);
        icons.forEach(icon => {
            icon.classList.add('fav-active');
            icon.classList.remove('uil-heart');
            icon.classList.add('uis-heart');
            icon.style.color = '#ff4757';
        });

        // Intentar también con la firma nueva
        const iconsV = document.querySelectorAll(`.fav-icon[onclick="toggleFavorite(${id}, true)"]`);
        iconsV.forEach(icon => {
            icon.classList.add('fav-active');
            icon.classList.remove('uil-heart');
            icon.classList.add('uis-heart');
            icon.style.color = '#ff4757';
        });
    });
}

function getFavoritesHtml() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) return "No tienes favoritos guardados 💔.";

    let html = "<b>❤️ Tus Favoritos:</b><br><ul style='padding-left:15px; margin:5px 0;'>";
    favorites.forEach(id => {
        id = Number(id);
        const p = (typeof productsData !== 'undefined') ? productsData.find(prod => prod.id === id) : null;
        if (p) {
            html += `
            <li style="margin-bottom:8px;">
                <strong>${p.nombre}</strong> (S/${p.precio})
                <br>
                <button onclick="addToCart(${p.id}, 1, true)" style="background:#0092E4; color:white; border:none; padding:2px 6px; cursor:pointer; font-size:0.75em; border-radius:3px;">Añadir</button>
                <button onclick="toggleFavorite(${p.id}, true);" style="background:#ffdddd; color:#d63031; border:none; padding:2px 6px; cursor:pointer; font-size:0.75em; border-radius:3px;">Quitar</button>
            </li>`;
        }
    });
    html += "</ul>";
    return html;
}
