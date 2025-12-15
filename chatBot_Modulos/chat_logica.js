function sendMessage() {
    const input = document.getElementById("user-input");
    const msg = input.value.trim();
    if (msg === "") return;

    addMessage("Tú", msg, "user");
    input.value = "";

    processUserMessage(msg);
}

function processUserMessage(msg) {
    const lower = msg.toLowerCase();

    // Simular "Escribiendo..." - R4iv1d 151225
    addMessage("ElectroBot", "Escribiendo...", "bot");

    setTimeout(() => {
        // Remover mensaje de escribiendo
        const chat = document.getElementById("chat-body");
        if (chat.lastChild.innerText.includes("Escribiendo...")) {
            chat.removeChild(chat.lastChild);
        } else {
            // Fallback por si acaso
            const messages = chat.getElementsByClassName("message");
            if (messages.length > 0) chat.removeChild(messages[messages.length - 1]);
        }

        let response = "";
        let isHtml = false;

        // --- LÓGICA DE COMANDOS --- // R4iv1d 151225

        // 1. Promociones
        if (lower.includes("promocion") || lower.includes("oferta")) {
            // productsData global
            const promos = productsData.filter(p => p.promocion);
            if (promos.length > 0) {
                response = "<b>🔥 Estas son nuestras promociones vigentes:</b><br><br>";
                promos.forEach(p => {
                    response += `
                        <div class="product-card-chat" style="border:1px solid #ddd; padding:5px; margin-bottom:5px; border-radius:5px;">
                            <strong>${p.nombre}</strong><br>
                            <span style="text-decoration:line-through; color:grey;">S/${p.precio}</span> 
                            <span style="color:red; font-weight:bold;">S/${p.precioPromocion}</span><br>
                            <small>Válido hasta: ${p.vigencia}</small><br>
                            <button onclick="addToCart(${p.id}, 1, true)" style="background:#0092E4; color:white; border:none; padding:3px 8px; cursor:pointer; margin-top:3px;">Añadir</button>
                        </div>`;
                });
                isHtml = true;
            } else {
                response = "Por el momento no tenemos promociones activas. ¡Pero revisa nuestros precios bajos!";
            }
        }

        // 2. Carrito
        else if (lower.includes("carrito") || lower.includes("cesta") || lower.includes("agregar") || lower.includes("añadir")) {
            if (lower.includes("ver") && (lower.includes("carrito") || lower.includes("cesta"))) {
                response = getCartHtml(); // Mostrar tabla (carrito.js)
                isHtml = true;
            } else if (lower.includes("vaciar") || lower.includes("borrar")) {
                sessionStorage.removeItem('cart');
                response = "He vaciado tu carrito de compras 🗑️.";
            } else if (lower.includes("agregar") || lower.includes("añadir")) {
                const qtyMatch = lower.match(/(\d+)/);
                let qty = 1;
                if (qtyMatch) {
                    qty = parseInt(qtyMatch[0]);
                }

                let term = lower.replace("agregar", "").replace("añadir", "").replace("al carrito", "").replace("carrito", "").replace(/\d+/g, "").trim();

                const prod = findProduct(term); // productos.js

                if (prod) {
                    addToCart(prod.id, qty, true); // carrito.js
                    return;
                } else if (term.length > 2) {
                    response = `No encontré el producto "${term}". ¿Podrías verificar el nombre?`;
                } else {
                    response = "¿Qué te gustaría agregar? Prueba: 'Agregar 2 lavadoras'.";
                }
            } else {
                response = "¿Quieres 'ver carrito' o buscas agregar algún producto?";
            }
        }

        // 3. Favoritos
        else if (lower.includes("favorito") || lower.includes("lista de deseos")) {
            if (lower.includes("ver")) {
                response = getFavoritesHtml(); // favoritos.js
                isHtml = true;
            } else if (lower.includes("agregar") || lower.includes("añadir")) {
                let term = lower.replace("agregar", "").replace("añadir", "").replace("a favoritos", "").replace("favoritos", "").trim();
                const prod = findProduct(term);
                if (prod) {
                    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
                    if (favs.includes(prod.id)) {
                        response = `ℹ️ Ya tienes el producto <b>${prod.nombre}</b> en tu lista de favoritos.`;
                    } else {
                        toggleFavorite(prod.id, true); // favoritos.js
                        return;
                    }
                } else {
                    response = "No entendí qué producto quieres agregar a favoritos. Intenta: 'Agregar [nombre] a favoritos'.";
                }
            } else {
                response = "Puedes decir 'Ver favoritos' o 'Agregar [producto] a favoritos'.";
            }
        }

        // 4. Comparar
        else if (lower.includes("comparar")) {
            if (lower.includes("limpiar")) {
                clearComparison(); // comparador.js
            } else {
                getComparisonHtml(); // comparador.js
            }
        }

        // 5. Búsqueda y Filtrado
        else if (lower.includes("buscar") || lower.includes("precio") || lower.includes("tienes") || lower.includes("lavadora") || lower.includes("tv") || lower.includes("televisor") || lower.includes("refrigeradora") || lower.includes("cocina")) {
            let searchTerm = lower.replace("buscar", "").replace("precio de", "").replace("tienes", "").trim();
            if (searchTerm.length < 3) searchTerm = lower;

            const results = searchProducts(searchTerm); // productos.js

            if (results.length > 0) {
                response = `Encontré ${results.length} coincidencias:<br><br>`;
                results.slice(0, 3).forEach(p => {
                    const price = p.promocion ? `<span style="color:red">S/${p.precioPromocion} (Oferta)</span>` : `S/${p.precio}`;
                    response += `
                        <div style="border-bottom:1px solid #eee; padding-bottom:5px; margin-bottom:5px;">
                            <strong>${p.nombre}</strong> - ${price}<br>
                            <small>${p.caracteristicas?.Potencia || p.caracteristicas?.Pantalla || p.categoria}</small><br>
                            <button onclick="addToCart(${p.id}, 1, true)" style="background:#0092E4; color:white; border:none; padding:3px 8px; cursor:pointer; border-radius:3px;">Añadir</button>
                            <button onclick="addToComparison(${p.id})" style="background:#f1c40f; color:#333; border:none; padding:3px 8px; cursor:pointer; margin-left:5px; border-radius:3px;">⚖️ Comparar</button>
                        </div>
                    `;
                });
                isHtml = true;
                if (results.length === 0) response += "<br>Intenta buscar por marca o categoría.";
            } else {
                response = "No encontré exactamente eso. " + getSuggestions();
            }
        }

        // 6. Saludo / Default
        else if (lower.includes("hola")) {
            response = "¡Hola! ¿En qué puedo ayudarte hoy? Pídeme buscar productos, ver ofertas o revisar tu carrito.";
        }
        else {
            response = "No estoy seguro de entenderte. Prueba con: 'Buscar cocina', 'Ver ofertas', 'Comparar [Prod A] con [Prod B]' o 'Ver carrito'.";
        }

        addMessage("ElectroBot", response, "bot", isHtml);
    }, 600);
}

function getSuggestions() {
    const promos = productsData.filter(p => p.promocion).slice(0, 2);
    if (promos.length > 0) {
        return `¿Quizás te interese ver nuestras ofertas en <b>${promos[0].nombre}</b>?`;
    }
    return "¿Te gustaría ver nuestra sección de Tienda?";
}
