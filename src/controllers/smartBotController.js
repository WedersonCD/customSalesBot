import  UTIL from "../utils/utils"
import { WHATSAPP_LINK }    from "../configs/messageConfig"
import {getNewChatCompletion} from "../configs/chatGPTConfig"

const chatArray =[]

const getEmptyChatObject = () =>{
    
    return {
        id: UTIL.generateUniqueId(),
        createdAt: UTIL.getCurrentTimesTamp(),
        lastInteractionAt: 0,
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



const createChat = (firstMessage) =>{

    chatObject      =   getEmptyChatObject()
    
    const systemMessage   =   getSystemMessage()

    chatObject.messages.push({role: 'system', content: systemMessage})
    chatObject.messages.push({role: 'user', content: firstMessage})
    
    chatObject.products=UTIL.getCsvAsArray('products')
    
    chatArray.push(chatObject)

    return chatObject.id

}

const getChat = (chatId) =>{

    return chatArray.filter((chat)=> chat.id==chatId)[0]

}

const setChatMessage = (chatId,role,message) =>{
    
    chat = getChat(chatId);
    chat.messages.push({role: role, content: message})

    return chatId

}

const createNewInteraction = async (chatId,message) =>{
    chat = getChat(chatId);
    
    chat.totalIterations+=1
    chat.lastInteractionAt=UTIL.getCurrentTimesTamp()
    setChatMessage(chatId,'user',message)
    chat.status='talking'
    const completion = await getNewChatCompletion(chat.messages)
    const awnser = completion.choices[0].message.content;
    setChatMessage(chatId,'assistant',awnser)
    chat.status='waiting'

    return {
        chatId: chatId,
        awnser: awnser
    }

}

export default {
    createChat,
    createNewInteraction
}

