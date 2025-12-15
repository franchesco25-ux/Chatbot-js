// Estado global de productos - R4iv1d 151225
let productsData = [];

// Cargar productos al iniciar - R4iv1d 151225
fetch('productos.json')
    .then(response => response.json())
    .then(data => {
        productsData = data;
        console.log("Productos cargados:", productsData.length);
        loadFavorites(); // Cargar favoritos visuales al iniciar
        renderCartUI();  // Actualizar badge y carrito
    })
    .catch(err => console.error("Error cargando productos:", err));

// --- Funciones Auxiliares de Búsqueda --- // R4iv1d 151225

function findProduct(term) {
    if (!term) return null;
    return productsData.find(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.marca.toLowerCase().includes(term) ||
        p.categoria.toLowerCase().includes(term)
    );
}

function searchProducts(term) {
    return productsData.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.marca.toLowerCase().includes(term) ||
        p.categoria.toLowerCase().includes(term)
    );
}
