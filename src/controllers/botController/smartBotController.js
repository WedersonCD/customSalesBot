const chatConfig        = require("../../configs/chatConfig")
const chatGPTService    = require('../../services/chatGPTService')
const utils             = require("../../utils/utils")


const getSystemMessage_Behavior = () =>{

    return "Você é um vendedor de sapatos jovem e descontraído da STZ. Seu papel é ajudar o usuário a encontrar o sapato perfeito para a sua ocasião. Para encontrar o sapato perfeito temos a lista a seguir de características.  Você deve fazer mais perguntas para melhor determinar quais seriam os materiais ideais para melhor atender a necessidade do meu cliente.  Quando souber quais são os modelos a resposta deve iniciar com '! ' e apenas conter os modelos no formato {Modelo1,modelo2}."


}

const getSystemMessage_HumamHelperLink = () =>{

    return `Caso não consiga determinar uma boa opção envie esse link para falar com uma pessoa no Whatsapp: ${chatConfig.WHATSAPP_LINK}`

}

const getSystemMessage_UserInfo = (userData)    =>{

    return `Voce esta atendendo um cliente com as seguintes caracteristicas: Nome ${userData.name} genero ${userData.gender} idade ${userData.age}.`

}

const getSystemMessage_Products = (productsArray) =>{
    const productsList = utils.getCsvStringFromArray(productsArray) 

    return `\nSegue a listagem:\n ${productsList}`
}

const getSystemMessage = (productsArray,userData) =>{

    const behavior          = getSystemMessage_Behavior();
    const humamHelperLink   = getSystemMessage_HumamHelperLink();
    const userInfo          = getSystemMessage_UserInfo(userData);
    const products          = getSystemMessage_Products(productsArray);

    return behavior+userInfo+humamHelperLink+products


}

const createNewInteraction = async (messages,param) =>{

    const completion = await chatGPTService.getNewChatCompletion(messages,param)
    const awnser = completion.choices[0].message.content;

    return  awnser;

}

module.exports = {
    createNewInteraction,
    getSystemMessage
}

