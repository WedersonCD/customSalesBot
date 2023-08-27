const smartBotController    = require('./botController/smartBotController');
const dumbBotController     = require('./botController/dumbBotController');
const chatConfig            = require("../configs/chatConfig")
const utils                 = require("../utils/utils")


const PRODUCSTS_PATH='../data/products.csv';

const chatArray =[]

const setChatMessage = (chat,role,message) =>{
    
    chat.messages.push({role: role, content: message})

    return chat

}

const getChat = async (req,res) =>{

    console.log(req)
    const chatId = req.header.chatId

    res.status(200).json(chatArray.filter((chat)=> chat.id==chatId)[0])

}

const setChatUser = (chat,userData)=>{
    chat.user=userData

}

const setChatProducts = (chatObject)=>{

    chatObject.products = utils.getCsvAsArray(PRODUCSTS_PATH)

}

const setChatName = (chatObject)=>{
    chatObject.name     =   chatConfig.BOT_NAME;

}



const getEmptyChatObject = () =>{
    
    return {
        id: utils.generateUniqueId(),
        createdAt: utils.getCurrentTimesTamp(),
        lastInteractionAt: 0,
        totalIterations: 0,
        status: 'created',
        name: '',
        user: {},
        products:[],
        messages: []
    }

}



const createChat = async (req,res) =>{

    const userData  = req.body.user;
    const message   = req.body.message

    chatObject          =   getEmptyChatObject()

    setChatProducts(chatObject)
    setChatName(chatObject)
    setChatUser(chatObject,userData)

    const systemMessage   = smartBotController.getSystemMessage(chatObject.products)
    const firstMessage    = dumbBotController.getUserTratedFirstMessage(userData,message)


    setChatMessage(chatObject,'system',systemMessage)
    setChatMessage(chatObject,'user',firstMessage)

    const defaultMessage = dumbBotController.getDefaultMessageInChatOpened()

    res.status(200).json({chatId: chatObject.id,defaultMessage: defaultMessage})

}

module.exports ={
    createChat,
    getChat
}