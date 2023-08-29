const chatConfig        = require("../../configs/chatConfig")
const chatGPTService    = require('../../services/chatGPTService')
const utils             = require("../../utils/utils")


const getSystemMessage_Behavior = () =>{

    return "Voce é um assistente virtual e deve ajudar o usuário a encontrar o sapato perfeito para a sua ocasião. Se necessário, faça perguntas para entender melhor a necessidade do usuário."


}

const getSystemMessage_HumamHelperLink = () =>{

    return `Caso não consiga determinar uma boa opção envie esse link para falar com uma pessoa no Whatsapp: ${chatConfig.WHATSAPP_LINK}`

}

const getSystemMessage_UserInfo = (userData)    =>{

    return `Voce esta atendendo um cliente com as seguintes caracteristicas: Nome ${userData.name} genero ${userData.gender} idade ${userData.age}.`

}

const getSystemMessage_Products = (productsString) =>{


    return `\nSegue a listagem de produtos disponiveis:\n ${productsString}`
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

    messagesWithRecommendedMessage.push({role: 'user', content: 'Responda apenas com os códigos dos produtos e nenhum outro texto. Se fossemos parar agora, quais produtos seriam os recomendados?'})
                                                                    //putting lower temperature to get more direc awnser
    return await createNewInteraction(messagesWithRecommendedMessage,{temperature:0.2});

}


module.exports = {
    createNewInteraction,
    getSystemMessage,
    getRecommendedGroupedProductMessage
}

