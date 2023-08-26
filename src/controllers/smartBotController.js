import  UTIL from "../utils/utils"
import { WHATSAPP_LINK }    from "../configs/messageConfig"

const chatArray =[]

const getEmptyChatObject = () =>{
    
    return {
        id: UTIL.generateUniqueId(),
        createdAt: new Date().getTime(),
        totalIterations: 0,
        status: 'created',
        user: {},
        products:[],
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

    const productsList = UTIL.getCsvAsString('products') 

    return `\nSegue a listagem:\n ${productsList}`
}

const getSystemMessage = () =>{

    const behavior          = getSystemMessage_Behavior();
    const humamHelperLink   = getSystemMessage_HumamHelperLink();
    const products          = getSystemMessage_Products();

    return behavior+humamHelperLink+products


}

const getUserFirstMessage = (userData,firstMessage) => {

    return `Sou o ${userData.nome} sexo ${userData.sexo} idade ${userData.idade}. ${firstMessage}`

}

const createNewChat = (userData,firstMessage) =>{

    chatObject      =   getEmptyChatObject()
    
    const systemMessage   =   getSystemMessage()
    const userMessage     =   getUserFirstMessage(userData,firstMessage)

    chatObject.messages.push({role: 'system', content: systemMessage})
    chatObject.messages.push({role: 'user', content: userMessage})
    
    chatObject.products=UTIL.getCsvAsArray('products')
    
    chatArray.push(chatObject)

    return chatObject
    
}

