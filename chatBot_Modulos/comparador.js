// --- Lógica de Comparación Dinámica (SessionStorage) --- // R4iv1d 151225

function addToComparison(id) {
    let list = JSON.parse(sessionStorage.getItem('comparisonList')) || [];

    if (list.includes(id)) {
        if (typeof addMessage === 'function') addMessage("ElectroBot", "⚠️ Este producto ya está en tu lista de comparación.", "bot");
        return;
    }

    if (list.length >= 3) {
        if (typeof addMessage === 'function') addMessage("ElectroBot", "⚠️ Solo puedes comparar hasta 3 productos a la vez. <button onclick='getComparisonHtml()' style='background:none; border:none; text-decoration:underline; cursor:pointer;'>Ver tabla</button> o <button onclick='clearComparison()' style='background:none; border:none; text-decoration:underline; cursor:pointer;'>Limpiar</button>", "bot", true);
        return;
    }

    list.push(id);
    sessionStorage.setItem('comparisonList', JSON.stringify(list));

    const prod = (typeof productsData !== 'undefined') ? productsData.find(p => p.id === id) : null;
    if (prod && typeof addMessage === 'function') {
        addMessage("ElectroBot", `⚖️ Agregado <b>${prod.nombre}</b>. Tienes ${list.length}/3 productos. <button onclick='getComparisonHtml()' style='border:1px solid #333; background:white; cursor:pointer; padding:2px 5px; border-radius:3px; margin-left:5px;'>Ver Comparación</button>`, "bot", true);
    }
}

function removeFromComparison(id) {
    let list = JSON.parse(sessionStorage.getItem('comparisonList')) || [];
    const index = list.indexOf(id);
    if (index > -1) {
        list.splice(index, 1);
        sessionStorage.setItem('comparisonList', JSON.stringify(list));
        if (typeof addMessage === 'function') addMessage("ElectroBot", "🗑️ Producto eliminado de la comparación.", "bot");

        getComparisonHtml(); // Auto-mostrar tabla actualizada
    }
}

function clearComparison() {
    sessionStorage.removeItem('comparisonList');
    if (typeof addMessage === 'function') addMessage("ElectroBot", "Lista de comparación vaciada.", "bot");
}

function getComparisonHtml() {
    let list = JSON.parse(sessionStorage.getItem('comparisonList')) || [];
    if (list.length === 0) {
        if (typeof addMessage === 'function') addMessage("ElectroBot", "Tu lista de comparación está vacía. Agrega productos buscando y pulsando '⚖️ Comparar'.", "bot");
        return;
    }
    if (list.length === 1) {
        if (typeof addMessage === 'function') addMessage("ElectroBot", "Necesitas al menos 2 productos para comparar. Agrega otro más.", "bot");
        return;
    }

    let html = `<div style="overflow-x:auto; margin-top:10px; padding-bottom:10px;">
                <table style="min-width:400px; width:100%; font-size:12px; border-collapse:collapse;">
                    <tr style="background:#f0f0f0;">
                        <th style="padding:8px; text-align:left; border-bottom:2px solid #ddd; min-width:80px;">Rasgo</th>`;

    // Headers (Nombres + Botón Quitar)
    list.forEach(id => {
        const p = productsData.find(prod => prod.id === id);
        html += `<th style="padding:4px; text-align:center; word-wrap:break-word;">
                    ${p.marca}<br>
                    <button onclick="removeFromComparison(${p.id})" style="color:red; font-size:9px; cursor:pointer; border:none; background:none;">[x] Quitar</button>
                 </th>`;
    });
    html += `</tr>`;

    // Filas
    const rows = [
        { label: "Nombre", key: "nombre" },
        { label: "Precio", key: "precio", format: (v) => `S/${v}` },
        { label: "Categ.", key: "categoria" }
    ];

    const firstP = productsData.find(p => p.id === list[0]);
    if (firstP && firstP.caracteristicas) {
        Object.keys(firstP.caracteristicas).forEach(k => {
            rows.push({ label: k, key: "caracteristicas", subKey: k });
        });
    }

    // Calcular el precio mínimo para resaltar
    let minPrice = Infinity;
    list.forEach(id => {
        const p = productsData.find(prod => prod.id === id);
        if (p) {
            const finalPrice = p.promocion ? p.precioPromocion : p.precio;
            if (finalPrice < minPrice) minPrice = finalPrice;
        }
    });

    rows.forEach(row => {
        html += `<tr><td style="padding:4px; font-weight:bold; border-bottom:1px solid #ddd;">${row.label}</td>`;
        list.forEach(id => {
            const p = productsData.find(prod => prod.id === id);
            let val = "";
            let style = "padding:4px; text-align:center; border-bottom:1px solid #ddd; word-wrap:break-word;";

            if (row.key === "precio") {
                const finalPrice = p.promocion ? p.precioPromocion : p.precio;
                if (finalPrice === minPrice) {
                    style += " color:green; font-weight:bold; background:#e8f5e9;"; // Resaltar el mejor precio
                }
                val = p.promocion ? `<span style="text-decoration:line-through; color:grey; font-size:0.9em;">S/${p.precio}</span> <br> S/${p.precioPromocion}` : `S/${p.precio}`;
            } else if (row.key === "caracteristicas") {
                val = p.caracteristicas ? (p.caracteristicas[row.subKey] || "-") : "-";
            } else {
                val = p[row.key];
            }
            html += `<td style="${style}">${val}</td>`;
        });
        html += `</tr>`;
    });

    // Fila Añadir al carrito
    html += `<tr><td></td>`;
    list.forEach(id => {
        html += `<td style="text-align:center; padding:5px;"><button onclick="addToCart(${id}, 1, true)" style="background:#0092E4; color:white; border:none; padding:3px 6px; cursor:pointer; border-radius:3px;">Añadir</button></td>`;
    });
    html += `</tr></table></div>`;

    if (typeof addMessage === 'function') addMessage("ElectroBot", html, "bot", true);
}
