const chatConfig = require("../../configs/chatConfig")


const getUserTratedFirstMessage = (userData,firstMessage) => {

    return `Sou o ${userData.nome} sexo ${userData.sexo} idade ${userData.idade}. ${firstMessage}`

}

const getDefaultMessageInChatOpened = () =>{
    return `Olá sou o ${chatConfig.BOT_NAME}! Seu assistente pessoal de compras.\n Como posso te ajudar?`
}

module.exports = {
    getUserTratedFirstMessage,
    getDefaultMessageInChatOpened
}


