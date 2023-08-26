import { generateUniqueId } from "../utils/utils"
import { WHATSAPP_LINK }    from "../configs/messageConfig"

const openedChatArray =[]

const getEmptyChatObject = () =>{

    return {
        id: generateUniqueId(),
        createdAt: new Date().getTime(),
        totalIterations: 0,
        messages: []
    }

}


const getSystemMessage_Behavior = () =>{

    return "Você é um vendedor de sapatos jovem e descontraído da STZ. Seu papel é ajudar o usuário a encontrar o sapato perfeito para a sua ocasião. Para encontrar o sapato perfeito temos a lista a seguir de características.  Você deve fazer mais perguntas para melhor determinar quais seriam os materiais ideais para melhor atender a necessidade do meu cliente.  Quando souber quais são os modelos a resposta deve iniciar com '! ' e apenas conter os modelos no formato {Modelo1,modelo2}."


}

const getSystemMessage_HumamHelperLink = () =>{

    return `Caso não consiga determinar uma boa opção envie esse link para falar com uma pessoa no Whatsapp: ${WHATSAPP_LINK}`

}

const getSystemMessage_Products = () =>{
    return
}

const createNewChat = () =>{

    chatObject      =   getEmptyChatObject()
    systemMessage   =   getSystemMessage()



}