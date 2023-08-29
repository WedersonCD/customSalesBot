const chatConfig        = require("../../configs/chatConfig")
const chatGPTService    = require('../../services/chatGPTService')
const utils             = require("../../utils/utils")


const getSystemMessage_Behavior = () =>{

    return "Seu papel é ajudar o usuário a encontrar o sapato perfeito para a sua ocasião. Se necessário, faça perguntas para entender melhor a necessidade do usuário."


}

const getSystemMessage_HumamHelperLink = () =>{

    return `Caso não consiga determinar uma boa opção envie esse link para falar com uma pessoa no Whatsapp: ${chatConfig.WHATSAPP_LINK}`

}

const getSystemMessage_UserInfo = (userData)    =>{

    return `Voce esta atendendo um cliente com as seguintes caracteristicas: Nome ${userData.name} genero ${userData.gender} idade ${userData.age}.`

}

const getSystemMessage_Products = (productsString) =>{


    return `\nSegue a listagem:\n ${productsString}`
}

const getSystemMessage = (productsString,userData) =>{

    const behavior          = getSystemMessage_Behavior();
    const humamHelperLink   = getSystemMessage_HumamHelperLink();
    const userInfo          = getSystemMessage_UserInfo(userData);
    const products          = getSystemMessage_Products(productsString);

    return behavior+userInfo+humamHelperLink+products


}

const createNewInteraction = async (messages,param) =>{

    const completion = await chatGPTService.getNewChatCompletion(messages,param)
    const awnser = completion.choices[0].message.content;

    return  awnser;

}

const getRecommendedGroupedProductMessage =  async (messages,param) =>{
    
    messagesWithRecommendedMessage = [... messages]

    messagesWithRecommendedMessage.push({role: 'user', content: 'Responda apenas com o código do produto e nenhum outro texto. Se fossemos parar agora, qual produto seria recomendado?'})

    return await createNewInteraction(messagesWithRecommendedMessage);

}


module.exports = {
    createNewInteraction,
    getSystemMessage,
    getRecommendedGroupedProductMessage
}

