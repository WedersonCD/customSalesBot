const chatConfig        =   require("../../configs/chatConfig")
const productsConfig    =   require("../../configs/productsConfig")


const getDefaultMessageInChatOpened = () =>{
    return `Olá sou o ${chatConfig.BOT_NAME}! Seu assistente pessoal de compras.\n Como posso te ajudar?`
}


const getRecommendedGroupedProductIdFromMessage = (message)=>{

    const matchedObject = message.match(new RegExp(productsConfig.DISTINCT_ID_PREFIX+"(\\d+)"))

    return matchedObject[0] || ''

}

const getRecommendedGroupedProductFromMessage = (chatObject,message)=>{
    recommendedGroupedProductId = getRecommendedGroupedProductIdFromMessage(message)
    return chatObject.products.grouped.filter((product)=>product[productsConfig.COLUMN_ID]===recommendedGroupedProductId)

}


module.exports = {
    getDefaultMessageInChatOpened,
    getRecommendedProductListFromMessage
}


