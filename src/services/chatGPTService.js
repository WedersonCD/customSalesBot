import {
    OPEN_IA_API_CONFIGURATION,
    OPEN_IA_DEFAULT_MODEL,
    OPEN_AI_DEFAULT_STREAM,
    OPEN_IA_DEFAULT_TEMPERATURE,
    OPEN_AI_DEFAULT_MAX_TOKENS
} from "../configs/chatGPTConfig"

import {OpenAI} from "openai";

const openAI_API = new OpenAI(OPEN_IA_API_CONFIGURATION);

const getNewChatCompletion = async (messages,params) =>{
    
    params = params || {}
    params.model        =   params.model        || OPEN_IA_DEFAULT_MODEL
    params.stream       =   params.stream       || OPEN_AI_DEFAULT_STREAM
    params.temperature  =   params.temperature  || OPEN_IA_DEFAULT_TEMPERATURE
    params.max_tokens   =   params.max_tokens   || OPEN_AI_DEFAULT_MAX_TOKENS
    params.messages     =   messages

    const chatCompletion = await openAI_API.chat.completions.create(params)

}

export default {
    getNewChatCompletion
}


