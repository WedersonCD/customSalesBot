const smartBotController = require('./botController/smartBotController');
const dumbBotController = require('./botController/dumbBotController');
const chatConfig = require("../configs/chatConfig")
const productsConfig = require("../configs/productsConfig")
const productController = require('./productController')

const utils = require("../utils/utils");
const openAiConfig = require('../configs/openIAConfig');


const PRODUCSTS_PATH = '../data/products/products.csv';

const chatArray = []


const getEmptyRecommendationObject = () => {
    return {
        createdAt: utils.getCurrentTimesTamp(),
        lastInteration: 0,
        awnserFromSmartBot: '',
        groupedProductsIdFromAwnser: [],
        groupedProductsId: [],
        groupedProducts: [],
        products: [],
        usage:{
            total:{
                tokens:0,
                inputTokens:0,
                outputTokens:0,
                cost:0
            },
            interactions: []
        }

    }
}

const getEmptyChatObject = () => {

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
        products: {
            raw: [],
            grouped: [],
            string: ""
        },
        messages: []
    }

}

const setChatMessage = (chat, role, message) => {

    chat.messages.push({ role: role, content: message })

    return chat

}


const getChatById = (chatId) => {
    return chatArray.filter((chat) => chat.id == chatId)[0]

}

const getChat = async (req, res) => {

    const chatId = req.query.chatId

    res.status(200).json(chatArray.filter((chat) => chat.id == chatId)[0])

}

const setChatUser = (chat, userData) => {
    chat.user = userData

}



const setChatProducts_String = (chatObject) => {


    chatObject.products.string = utils.getCopyOfArrayOfObjects(chatObject.products.grouped)

    productsConfig.COLUMN_TO_AGRUP.forEach((columnName)=>{

        utils.deletePropertieFromObjectsInArray(chatObject.products.string, columnName)
        utils.deletePropertieFromObjectsInArray(chatObject.products.string, columnName+'_Array')
    })

    utils.deletePropertieFromObjectsInArray(chatObject.products.string, 'groupedObjectKey')
    utils.deletePropertieFromObjectsInArray(chatObject.products.string, 'embeddings')
    chatObject.products.string = utils.getCsvStringFromArray(chatObject.products.string)

}

const setChatProducts_GroupedFromRandomSample = (chatObject) => {

    chatObject.products.grouped = productController.getRandomSampleOfGroupedProducts(0.6)
}

const setChatProducts_RawFromGroupedProducts = (chatObject) => {

    const rawProductIdArray = []

    chatObject.products.grouped.forEach((groupedProduct) => {
        groupedProduct[productsConfig.COLUMN_ID+'_Array'].forEach((id) => {
            rawProductIdArray.push(id)
        })
    })

    chatObject.products.raw = productController.getRawProductFromIdArray(rawProductIdArray)
}

const setChatProductsInitial = (chatObject) => {

    setChatProducts_GroupedFromRandomSample(chatObject)
    setChatProducts_RawFromGroupedProducts(chatObject)
    setChatProducts_String(chatObject)

}

const setChatName = (chatObject) => {
    chatObject.name = chatConfig.BOT_NAME;

}

const createChat = async (req, res) => {

    const userData = req.body.user;

    chatObject = getEmptyChatObject()

    setChatProductsInitial(chatObject)
    const systemMessage = smartBotController.getSystemMessage(chatObject.products.string, userData)

    setChatName(chatObject)
    setChatUser(chatObject, userData)
    setChatMessage(chatObject, 'system', systemMessage)

    const defaultMessage = dumbBotController.getDefaultMessageInChatOpened()

    chatArray.push(chatObject)

    res.status(200).json({ chatId: chatObject.id, message: defaultMessage })

}

const addChatInteraction = (chatObject) => {
    chatObject.totalIterations += 1
    chatObject.lastInteractionAt = utils.getCurrentTimesTamp()

}

const setChatCost =(chatObject)=>{
    const inputCost = chatObject.usage.total.inputTokens/openAiConfig.MODEL_COST_TOKENS_DIVIDER * openAiConfig.MODEL_COST_INPUT
    const outpuCost = chatObject.usage.total.inputTokens/openAiConfig.MODEL_COST_TOKENS_DIVIDER * openAiConfig.MODEL_COST_OUPUT

    chatObject.usage.total.cost=inputCost+outpuCost

}



const setChatUsage = (chatObject,usage)=>{

    chatObject.usage.interactions.push(usage)
    chatObject.usage.total.tokens+=usage.total_tokens
    chatObject.usage.total.inputTokens+=usage.prompt_tokens
    chatObject.usage.total.outputTokens+=usage.completion_tokens
    setChatCost(chatObject)

}

const sendChatMessage = async (req, res) => {

    const chatId = req.body.chatId
    const message = req.body.message

    chatObject = getChatById(chatId)

    try {
        setChatMessage(chatObject, 'user', message)

        //*
        chatObject.status = 'talking'
        const interaction = await smartBotController.createNewInteraction(chatObject.messages)
        const awnser    = interaction.awnser
        const usage     = interaction.usage
        setChatMessage(chatObject, 'assistant', awnser)
        setChatUsage(chatObject,usage)
        chatObject.status = 'waiting'
        addChatInteraction(chatObject)

        res.status(200).json({ chatId: chatId, question: message, awnser: awnser })
        //*/
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }

}
const getChatFilePathFromId = (chatId) => {
    return chatConfig.STORE_PATH + '/' + chatId + '.json'
}

const saveChat = async (req, res) => {

    const chatId = req.body.chatId
    const chatObject = getChatById(chatId)
    console.log(chatObject.id)
    const filePath = getChatFilePathFromId(chatId)
    utils.storeObjectAsJsonFile(chatObject, filePath)

    res.status(200).json({ chatId: chatId, filePath: filePath })

}

const loadSavedChat = async (req, res) => {
    const chatId = req.body.chatId
    const filePath = getChatFilePathFromId(chatId)
    const chatObject = utils.getJsonFileAsObject(filePath)
    chatArray.push(chatObject)

    res.status(200).json({ chatId: chatId, filePath: filePath })

}

const setChatProductRecommendation = (chatObject, recommendation) => {
    chatObject.recommendations.push(recommendation)

}

const setRecommendationLastInteration = (recommendationObject, chatObject) => {

    recommendationObject.lastInteration = chatObject.totalIterations

}


const setRecommendationAwnserFromSmartBot = async (recommendationObject, chatObject) => {

    //if the last message is a recomendation it is used otherwise get a pure recommendation from the smartBot
    const lastMessage = chatObject.messages[chatObject.messages.length - 1].content
    if (dumbBotController.MessageHaveAtLeastOneProductRecomendation(lastMessage)) {
        recommendationObject.awnserFromSmartBot = lastMessage;

    } else {
        const interaction= await smartBotController.getRecommendedGroupedProductMessage(chatObject.messages);
        recommendationObject.awnserFromSmartBot =interaction.awnser
        setChatUsage(interaction.usage) 
    }

}

const setRecommendationGroupedProductsIdFromAwnser = async (recommendationObject) => {
    recommendationObject.groupedProductsIdFromAwnser = dumbBotController.getRecommendedGroupedProductIdArrayFromMessage(recommendationObject.awnserFromSmartBot);

}

const setRecommendationGroupedProducts = (recommendationObject) => {
    recommendationObject.groupedProducts = recommendationObject.groupedProductsId.map((id) => {
        return productController.getGroupedProductsFromId(id)
    })

}

const setRecommendationProducts = (recommendationObject) => {

    recommendationObject.groupedProducts.forEach((groupedProduct) => {
        productController.getRawProductFromIdArray(groupedProduct[productsConfig.COLUMN_ID + '_Array']).forEach(product => {
            recommendationObject.products.push(product)
        })
    })
}
const setRecommendationGroupedProductsId = async (recommendationObject)=>{
        recommendationObject.groupedProductsId = productController.getMoreSimilarGroupedProductsIds(recommendationObject.groupedProductsIdFromAwnser[0],10)
        
}

const getProductRecommendation = async (req, res) => {

    try {
        const chatId = req.query.chatId
        const chatObject = getChatById(chatId)
        const recommendationObject = getEmptyRecommendationObject();
        chatObject.status = 'getting recomendation'
        setRecommendationLastInteration(recommendationObject, chatObject)
        await setRecommendationAwnserFromSmartBot(recommendationObject, chatObject)
        setRecommendationGroupedProductsIdFromAwnser(recommendationObject, chatObject)
        setRecommendationGroupedProductsId(recommendationObject)
        setRecommendationGroupedProducts(recommendationObject, chatObject)
        setRecommendationProducts(recommendationObject, chatObject)
        setChatProductRecommendation(chatObject, recommendationObject)
        chatObject.status = 'waiting'
        res.status(200).json(recommendationObject)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })

    }

}

const setChatProducts = (chatObject)=>{
    return;

}

const setChatProductFromRecommendation = async(req,res)=>{
    try {
        const chatId = req.body.chatId
        
        const chatObject = getChatById(chatId)

        const lastChatRecomendation = chatObject.recommendations[chatObject.recommendations.length-1]
        chatObject.products.raw = lastChatRecomendation.products
        chatObject.products.grouped = lastChatRecomendation.groupedProducts
        setChatProducts_String(chatObject)
        const systemMessage = smartBotController.getSystemMessage(chatObject.products.string)
        setChatMessage(chatObject, 'system', systemMessage)
        res.status(200).json(chatObject)

    
    }catch(error){

        res.status(500).json({error: error})
    }
}

const getChatCost = async(req,res)=>{
    try {
        const chatId = req.body.chatId
        const chatObject = getChatById(chatId)
        res.status(200).json(chatObject.usage.total)

    }catch(error){

        res.status(500).json({error: error})
    }
}
getChatCost

module.exports = {
    createChat,
    getChat,
    sendChatMessage,
    getProductRecommendation,
    saveChat,
    loadSavedChat,
    setChatProductFromRecommendation,
    getChatCost
}