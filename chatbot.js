document.getElementById("chatbot-button").onclick = toggleChat;

function toggleChat() {
    const chat = document.getElementById("chatbot-container");
    chat.style.display = (chat.style.display === "flex") ? "none" : "flex";
}

function addMessage(sender, text, type) {
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
    bubble.innerHTML = `<b>${sender}:</b> ${text}`;

    message.appendChild(avatar);
    message.appendChild(bubble);

    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
}


function sendMessage() {
    const input = document.getElementById("user-input");
    const msg = input.value.trim();
    if (msg === "") return;

    addMessage("Tú", msg, "user");
    input.value = "";

    botResponse(msg);
}


function botResponse(text) {
    const lower = text.toLowerCase();
    let resp = "No entendí 🤖 ¿Puedes repetir?";

    if (lower.includes("hola")) resp = "¡Hola! Soy ElectroBot 🤖 ¿Qué deseas saber?";
    if (lower.includes("lavadora")) resp = "Tenemos lavadoras Samsung desde S/ 1299.";
    if (lower.includes("televisor")) resp = "Los televisores LG empiezan en S/ 999.";
    if (lower.includes("precio")) resp = "¿De qué producto deseas saber el precio?";
    if (lower.includes("garantía")) resp = "Todos los productos tienen 1 año de garantía.";
    if (lower.includes("Ventilador")) resp = "Ventilador Imaco a tan solo S/200.50";
    

    addMessage("ElectroBot", "Escribiendo...", "bot");

    setTimeout(() => {
        const chat = document.getElementById("chat-body");
        chat.lastChild.querySelector(".bubble").innerHTML = `<b>ElectroBot:</b> ${resp}`;
    }, 900);
}


function clearChat() {
    document.getElementById("chat-body").innerHTML = "";
    addMessage("ElectroBot", "Chat reiniciado 🤖¿En qué puedo ayudarte ahora?", "bot");
}
