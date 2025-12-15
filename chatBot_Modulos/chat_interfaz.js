// Estado global de la interfaz - R4iv1d 151225
let chatOpen = false;

function toggleChat() {
    const chat = document.getElementById("chatbot-container");
    chatOpen = !chatOpen;
    chat.style.display = chatOpen ? "flex" : "none";

    if (chatOpen && document.getElementById("chat-body").children.length === 0) {
        addMessage("ElectroBot", "¡Hola! Soy ElectroBot 🤖. Puedo ayudarte a buscar productos, ver promociones, comparar opciones o gestionar tu carrito. ¿Qué deseas hacer hoy?", "bot");
    }
}

function clearChat() {
    const chat = document.getElementById("chat-body");
    chat.innerHTML = ""; // Limpiar todo
    addMessage("ElectroBot", "¡Hola de nuevo! 🤖 ¿En qué puedo ayudarte ahora?", "bot");
}

function addMessage(sender, text, type, isHtml = false) {
    const chat = document.getElementById("chat-body");

    const message = document.createElement("div");
    message.className = `message ${type}`;

    const avatar = document.createElement("img");
    avatar.src = (type === "user")
        ? "inicio/media/galeria-inicio/usuario.png"
        : "inicio/media/galeria-inicio/electrobot.png";
    avatar.alt = (type === "user") ? "Avatar usuario" : "Avatar ElectroBot";

    const bubble = document.createElement("div");
    bubble.className = "bubble";

    if (isHtml) {
        bubble.innerHTML = `<b>${sender}:</b><br>${text}`;
    } else {
        bubble.innerHTML = `<b>${sender}:</b> ${text}`;
    }

    message.appendChild(avatar);
    message.appendChild(bubble);

    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
}

// Inicialización del Botón   - R4iv1d 151225
document.addEventListener("DOMContentLoaded", () => {
    const chatbotBtn = document.getElementById("chatbot-button");
    if (chatbotBtn) {
        chatbotBtn.onclick = toggleChat;
    }
});
