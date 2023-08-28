const smartBotController    = require('./botController/smartBotController');
const dumbBotController     = require('./botController/dumbBotController');
const chatConfig            = require("../configs/chatConfig")
const productsConfig        = require("../configs/productsConfig")

const utils                 = require("../utils/utils")


const PRODUCSTS_PATH='../data/products.csv';

const chatArray =[]

const getEmptyChatObject = () =>{
    
    return {
        id: utils.generateUniqueId(),
        createdAt: utils.getCurrentTimesTamp(),
        lastInteractionAt: 0,
        totalIterations: 0,
        status: 'created',
        name: '',
        user: {
            name: "",
            age: 0,
            gender: ""
        },
        recommendedProduct: '',  
        products:{
            raw:[],
            grouped:[],
            string:""
        },
        messages: []
    }

}

const setChatMessage = (chat,role,message) =>{
    
    chat.messages.push({role: role, content: message})

    return chat

}

const getChatById =  (chatId) =>{

    return chatArray.filter((chat)=> chat.id==chatId)[0]

}

const getChat = async (req,res) =>{

    const chatId = req.query.chatId

    res.status(200).json(chatArray.filter((chat)=> chat.id==chatId)[0])

}

const setChatUser = (chat,userData)=>{
    chat.user=userData

}

const setChatProducts_Raw = (chatObject)=>{
    chatObject.products.raw= utils.getCsvAsArray(PRODUCSTS_PATH)
}

const setChatProducts_grouped = (chatObject)=>{
    chatObject.products.grouped=utils.getGroupPropertiesFromArrayOfObjects(chatObject.products.raw,[productsConfig.COLUMN_ID,productsConfig.COLUMN_COLOR])
    utils.setSequencialIDToArrayOfObjects(chatObject.products.grouped,'!codigo',productsConfig.DISTINCT_ID_PREFIX)

}

const setChatProducts_String = (chatObject)=>{

    chatObject.products.string = utils.getCopyOfArrayOfObjects(chatObject.products.grouped)
    utils.deletePropertieFromObjectsInArray(chatObject.products.string,productsConfig.COLUMN_ID)
    utils.deletePropertieFromObjectsInArray(chatObject.products.string,productsConfig.COLUMN_ID+'_Array')
    utils.deletePropertieFromObjectsInArray(chatObject.products.string,productsConfig.COLUMN_COLOR)
    utils.deletePropertieFromObjectsInArray(chatObject.products.string,productsConfig.COLUMN_COLOR+'_Array')
    utils.deletePropertieFromObjectsInArray(chatObject.products.string,'groupedObjectKey')

    chatObject.products.string = utils.getCsvStringFromArray(chatObject.products.string)

}


const setChatProducts = (chatObject)=>{

    setChatProducts_Raw(chatObject)
    setChatProducts_grouped(chatObject) 
    setChatProducts_String(chatObject)

}

const setChatName = (chatObject)=>{
    chatObject.name     =   chatConfig.BOT_NAME;

}

const setChatRecommendedProduct = (chatObject,recommendedProduct)=>{
    chatObject.recommendedProduct     =  recommendedProduct;

}


const createChat = async (req,res) =>{

    const userData  = req.body.user;

    chatObject          =   getEmptyChatObject()

    setChatProducts(chatObject)
    const systemMessage   = smartBotController.getSystemMessage(chatObject.products.string,userData)

    setChatName(chatObject)
    setChatUser(chatObject,userData)
    setChatMessage(chatObject,'system',systemMessage)

    const defaultMessage = dumbBotController.getDefaultMessageInChatOpened()
    
    chatArray.push(chatObject)

    res.status(200).json({chatId: chatObject.id,defaultMessage: defaultMessage})

}

const addChatInteraction =(chatObject)=>{
    chatObject.totalIterations+=1
    chatObject.lastInteractionAt=utils.getCurrentTimesTamp()

}

const sendChatMessage = async (req,res) =>{

    const chatId = req.body.chatId
    const message = req.body.message

    chatObject = getChatById(chatId)

    try {
        setChatMessage(chatObject,'user',message)

        //*
        chatObject.status='talking'
        const awnser = await smartBotController.createNewInteraction(chatObject.messages)
        setChatMessage(chatObject,'assistant',awnser)
        chatObject.status='waiting'
        addChatInteraction(chatObject)
    
        res.status(200).json({chatId: chatId,question: message,awnser: awnser})
        //*/
    }catch(error){
        console.log(error)
        res.status(500).json({error: error})
    }

}

const getRecommendedProductFromChat = async (chatObject) =>{

    return  await   smartBotController.getRecommendedProduct(chatObject.messages)

}


const getRecommendedProduct = async (req,res) =>{
    
    const chatId = req.query.chatId

    chatObject = getChatById(chatId)

    try{
        const recommendedProduct = await getRecommendedProductFromChat(chatObject);
        setChatRecommendedProduct(chatObject,recommendedProduct)
        res.status(200).json({chatId: chatId,recommendedProduct: recommendedProduct})

    }catch(error){
        console.log(error)
        res.status(500).json({error: error})

    }


}




module.exports ={
    createChat,
    getChat,
    sendChatMessage,
    getRecommendedProduct
}