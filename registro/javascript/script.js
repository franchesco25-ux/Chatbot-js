const formIniciarSesion = document.getElementById("formIniciarSesion");
formIniciarSesion.addEventListener("submit", function (event) {
    event.preventDefault(); 
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;
    if (usuario.trim() !== "" && contrasena.trim() !== "") {
        window.location.href = "tienda/index.html";
    } else {
        alert("Por favor, completa ambos campos."); 
    }
});
