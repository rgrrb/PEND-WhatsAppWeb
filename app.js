// ======================================================
// WhatsApp Web - Front conectado à API hospedada
// Autor: Roger Ribeiro de Oliveira
// ======================================================

const API_BASE = "https://api-whatsapp-toxy.onrender.com/v1/whatsapp";
const USER_NUMBER = 11987876567;

const contactsContainer = document.querySelector(".contacts-chat");
const chatHeader = document.querySelector(".contact-header");
const chatContainer = document.querySelector(".messages");
const messageInput = document.querySelector(".input-send-message input");
const sendButton = document.querySelector("#send-message");

let selectedContact = null;

async function pegarContatos() {
    try {
        const response = await fetch(`${API_BASE}/users/${USER_NUMBER}/contacts`);
        if (!response.ok) throw new Error("Erro ao buscar contatos");
        const data = await response.json();
        return data.userInfo[0]?.contacts || [];
    } catch (err) {
        console.error("Erro ao pegar contatos:", err);
        return [];
    }
}

async function pegarMensagens(contactNumber) {
    try {
        const url = `${API_BASE}/users/messages/contact?number=${USER_NUMBER}&contact=${contactNumber}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao buscar mensagens");
        const data = await response.json();

        const messages =
            data.userInfo?.exchangedMessages?.messages ||
            data.userInfo?.exchangedMessages ||
            [];
        return messages;
    } catch (err) {
        console.error("Erro ao pegar mensagens:", err);
        return [];
    }
}

async function renderContacts(contacts) {
    contactsContainer.textContent = "";

    for (const contact of contacts) {
        const messages = await pegarMensagens(contact.number);
        const lastMsg = messages[messages.length - 1];

        const contactDiv = document.createElement("div");
        contactDiv.classList.add("contact");

        const img = document.createElement("img");
        img.src = "./src/img/nopfpUser.jfif";

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("info");

        const contactInfo = document.createElement("div");
        contactInfo.classList.add("contact-info");

        const spanName = document.createElement("span");
        spanName.textContent = contact.name || "Desconhecido";

        const pTime = document.createElement("p");
        pTime.textContent = lastMsg?.time || "";

        const lastMessage = document.createElement("span");
        lastMessage.classList.add("last-message");
        lastMessage.textContent = lastMsg?.content || "Clique para conversar";

        contactInfo.appendChild(spanName);
        contactInfo.appendChild(pTime);
        infoDiv.appendChild(contactInfo);
        infoDiv.appendChild(lastMessage);

        contactDiv.appendChild(img);
        contactDiv.appendChild(infoDiv);

        contactDiv.addEventListener("click", () => selectContact(contact));
        contactsContainer.appendChild(contactDiv);
    }
}


function renderHeader(contact) {
    const contactName = chatHeader.querySelector(".contact-name");
    const profileImg = chatHeader.querySelector(".profile-contact-picture");

    if (!contactName || !profileImg) {
        console.error("Elementos do cabeçalho não encontrados");
        return;
    }

    contactName.textContent = contact.name || contact.number;
    profileImg.src = "./src/img/nopfpUser.jfif";;
}


function renderChat(messages) {
  chatContainer.textContent = "";

  if (!messages || messages.length === 0) {
    const empty = document.createElement("div");
    empty.classList.add("alert");
    empty.textContent = "Nenhuma mensagem encontrada.";
    chatContainer.appendChild(empty);
    return;
  }

  messages.forEach((msg) => {
    const msgDiv = document.createElement("div");

    const isUser = msg.sender === "me";
    msgDiv.classList.add(isUser ? "user-message" : "contact-message");

    const textSpan = document.createElement("span");
    textSpan.textContent = msg.content;

    const timeSpan = document.createElement("span");
    timeSpan.textContent = msg.time || "";

    msgDiv.appendChild(textSpan);
    msgDiv.appendChild(timeSpan);
    chatContainer.appendChild(msgDiv);
  });

  chatContainer.scrollTop = chatContainer.scrollHeight;
}


async function selectContact(contact) {
  currentContact = contact;
  renderHeader(contact);

  const messages = await pegarMensagens(contact.number);
  renderChat(messages, contact);
}

async function init() {
    const contacts = await pegarContatos();
    if (!contacts.length) {
        console.error("Nenhum contato encontrado para este usuário.");
        return;
    }

    await renderContacts(contacts);
    selectContact(contacts[0]);
}

init();
