const smartBotController    = require('./botController/smartBotController');
const dumbBotController     = require('./botController/dumbBotController');
const chatConfig            = require("../configs/chatConfig")
const productsConfig        = require("../configs/productsConfig")

const utils                 = require("../utils/utils")


const PRODUCSTS_PATH='../data/products.csv';

const chatArray =[]


const getEmptyRecommendationObject = () =>{
    return            {
        createdAt:utils.getCurrentTimesTamp(),
        lastInteration: 0,
        awnserFromSmartBot: '',
        groupedProductsId: [],
        groupedProducts: [],
        products:[]

    }
}

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
        recommendations: [],
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
    utils.setSequencialIDToArrayOfObjects(chatObject.products.grouped,productsConfig.DISTINCT_ID_COLUMN,productsConfig.DISTINCT_ID_PREFIX)

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
const getChatFilePathFromId = (chatId)=>{
    return chatConfig.STORE_PATH+'/'+chatId+'.json'
}

const saveChat = async (req,res) =>{

    const chatId = req.body.chatId
    const chatObject = getChatById(chatId)
    const filePath = getChatFilePathFromId(chatId)
    utils.storeObjectAsJsonFile(chatObject,filePath)

    res.status(200).json({chatId: chatId,filePath: filePath})

}

const loadSavedChat = async (req,res) =>{
    const chatId = req.body.chatId
    const filePath = getChatFilePathFromId(chatId)
    const chatObject = utils.getJsonFileAsObject(filePath)
    chatArray.push(chatObject)

    res.status(200).json({chatId: chatId,filePath: filePath})

}

const setChatProductRecommendation = (chatObject,recommendation) =>{
    chatObject.recommendations.push(recommendation)

}

const getRecommendedGroupedProductFromId = (chatObject,recommendedGroupedProductId)=>{
    const recommendedGroupedProduct= chatObject.products.grouped.filter((product)=>product[productsConfig.DISTINCT_ID_COLUMN]==recommendedGroupedProductId)
    return recommendedGroupedProduct[0]

}

const setRecommendationLastInteration = (recommendationObject,chatObject)=>{

    recommendationObject.lastInteration     = chatObject.totalIterations

}


const setRecommendationAwnserFromSmartBot = async (recommendationObject,chatObject) =>{
    
    //if the last message is a recomendation it is used otherwise get a pure recommendation from the smartBot
    const lastMessage=chatObject.messages[chatObject.messages.length-1].content
    if(dumbBotController.MessageHaveAtLeastOneProductRecomendation(lastMessage)){
        recommendationObject.awnserFromSmartBot = lastMessage;

    }else{
        recommendationObject.awnserFromSmartBot = await smartBotController.getRecommendedGroupedProductMessage(chatObject.messages);

    }


}

const setRecommendationGroupedProductsId = async (recommendationObject) =>{
    recommendationObject.groupedProductsId  = dumbBotController.getRecommendedGroupedProductIdArrayFromMessage(recommendationObject.awnserFromSmartBot);

}

const setRecommendationGroupedProducts = (recommendationObject,chatObject)=>{
    recommendationObject.groupedProducts = recommendationObject.groupedProductsId.map((id)=>{
        return getRecommendedGroupedProductFromId(chatObject,id)
    })

}
const getChatRawProductFromIdArray = (chatObject,productIdArray)=>{
    const rawProduct=chatObject.products.raw.filter((product)=>productIdArray.includes(product[productsConfig.COLUMN_ID]))
    return rawProduct
    
}

const setRecommendationProducts = (recommendationObject,chatObject) =>{

    recommendationObject.products = recommendationObject.groupedProducts.map((groupedProduct)=>{
        return getChatRawProductFromIdArray(chatObject,groupedProduct[productsConfig.COLUMN_ID+'_Array'])
    })
}

const getProductRecommendation = async (req,res) =>{

    try {
        const chatId = req.query.chatId
        const chatObject             = getChatById(chatId)
        const recommendationObject   = getEmptyRecommendationObject();
        chatObject.status='getting recomendation'
        setRecommendationLastInteration(recommendationObject,chatObject)
        await setRecommendationAwnserFromSmartBot(recommendationObject,chatObject)
        setRecommendationGroupedProductsId(recommendationObject,chatObject)
        setRecommendationGroupedProducts(recommendationObject,chatObject)
        setRecommendationProducts(recommendationObject,chatObject)   
        setChatProductRecommendation(chatObject,recommendationObject)
        chatObject.status='waiting'
        res.status(200).json(recommendationObject)
        
    }catch(error){
        console.log(error)
        res.status(500).json({error: error})

    }

}




module.exports ={
    createChat,
    getChat,
    sendChatMessage,
    getProductRecommendation,
    saveChat,
    loadSavedChat
}