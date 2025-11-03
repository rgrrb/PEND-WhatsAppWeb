'use strict'

const numero = 11987876567;

async function pegarUsuarios(numero) {
    const url = `https://api-whatsapp-toxy.onrender.com/v1/whatsapp/users/list`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
    return data
}
async function pegarMensagens(numero) {
    const url = `https://api-whatsapp-toxy.onrender.com/v1/whatsapp/users/${numero}/messages`
    const response = await fetch(url)
    const data = await response.json()  
    console.log(data)
    return data
}
async function criarContatos(usuario) {
    const userContent = await pegarMensagens(usuario)
    console.log(userContent)
    
    userContent.userInfo.messagesExchanged.forEach(() => {
        

        const contactsChat = document.getElementsByClassName('contacts-chat')

        const contact = document.createElement('div')
        contact.classList.add('contact')
        
        const fotoDePerfil = document.createElement('img')

        const info = document.createElement('div')
        info.classList.add('info')

        const contactInfo = document.createElement('div')
        contactInfo.classList.add('contact-info')

        const contactName = document.createElement('span')
        userContent.messagesExchanged.forEach((contato) => {
            contactName.textContent = contato.name

            
        })


        const lastMessage = document.createElement('span')
        lastMessage.classList.add('last-message')
    })



}

criarContatos(numero)