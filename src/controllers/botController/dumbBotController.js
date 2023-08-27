const chatConfig = require("../../configs/chatConfig")



const getDefaultMessageInChatOpened = () =>{
    return `Olá sou o ${chatConfig.BOT_NAME}! Seu assistente pessoal de compras.\n Como posso te ajudar?`
}

module.exports = {
    getDefaultMessageInChatOpened
}


