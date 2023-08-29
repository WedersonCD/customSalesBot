const chatConfig        =   require("../../configs/chatConfig")
const productsConfig    =   require("../../configs/productsConfig")


const getDefaultMessageInChatOpened = () =>{
    return `Olá sou o ${chatConfig.BOT_NAME}! Seu assistente pessoal de compras.\n Como posso te ajudar?`
}



const getRecommendedGroupedProductIdFromMessage = (message)=>{
    matchedObject = message.match(new RegExp(productsConfig.DISTINCT_ID_PREFIX+"(\\d+)"))
    matchedObject = matchedObject || [] 

    return matchedObject[0] || ''

}

const MessageHaveAtLeastOneProductRecomendation = (message) =>{
    tratedMessed = getRecommendedGroupedProductIdFromMessage(message)
    return tratedMessed && tratedMessed.length>1
}


const getRecommendedGroupedProductIdArrayFromMessage = (message)=>{


    const recommendedGroupedProductIdArray = []

    tratedMessage = message
    groupedProductId = getRecommendedGroupedProductIdFromMessage(tratedMessage)

    while(groupedProductId!=''){
        recommendedGroupedProductIdArray.push(groupedProductId)
        tratedMessage=tratedMessage.replace(groupedProductId,'')
        groupedProductId = getRecommendedGroupedProductIdFromMessage(tratedMessage)
    }

    return recommendedGroupedProductIdArray;

}

module.exports = {
    getDefaultMessageInChatOpened,
    getRecommendedGroupedProductIdArrayFromMessage,
    MessageHaveAtLeastOneProductRecomendation
}


