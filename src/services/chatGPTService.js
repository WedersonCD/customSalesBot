const chatGPTConfig = require("../configs/chatGPTConfig")
const OpenAI = require("openai")

const openAI_API = new OpenAI(chatGPTConfig.OPEN_IA_API_CONFIGURATION);

const getNewChatCompletion = async (messages,params) =>{
    
    params = params || {}
    params.model        =   params.model        || chatGPTConfig.OPEN_IA_DEFAULT_MODEL
    params.stream       =   params.stream       || chatGPTConfig.OPEN_AI_DEFAULT_STREAM
    params.temperature  =   params.temperature  || chatGPTConfig.OPEN_IA_DEFAULT_TEMPERATURE
    params.max_tokens   =   params.max_tokens   || chatGPTConfig.OPEN_AI_DEFAULT_MAX_TOKENS
    params.messages     =   messages

    const chatCompletion = await openAI_API.chat.completions.create(params)

}

module.exports = {
    getNewChatCompletion
}


