const openAiConfig = require("../configs/openIAConfig");
const openIAConfig = require("../configs/openIAConfig")
const OpenAI = require("openai")

const openAI_API = new OpenAI(openIAConfig.API_CONFIGURATION);

const getNewChatCompletion = async (messages,params) =>{
    
    params = params || {}
    params.model        =   params.model        || openIAConfig.DEFAULT_CHAT_MODEL
    params.stream       =   params.stream       || openIAConfig.DEFAULT_STREAM
    params.temperature  =   params.temperature  || openIAConfig.DEFAULT_TEMPERATURE
    params.max_tokens   =   params.max_tokens   || openIAConfig.DEFAULT_MAX_TOKENS
    params.messages     =   messages
    const completions = await openAI_API.chat.completions.create(params)
    return completions

}

const getEmbeddigns = async (textArray,params) =>{

    params = params || {}
    params.model = params.model || openIAConfig.DEFAULT_EMBEDDING_MODEL

    return await openAI_API.embeddings.create({
        model: openAiConfig.DEFAULT_EMBEDDING_MODEL,
        input: textArray
    })

}


module.exports = {
    getNewChatCompletion,
    getEmbeddigns
}


