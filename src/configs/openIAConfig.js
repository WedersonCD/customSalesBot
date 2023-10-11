
const openAiConfig = {};

openAiConfig.SECRET_KEY = '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';
openAiConfig.ORGANIZATION_ID='org-DcCBYIlOD6cf96VFX2fmRzpq';

openAiConfig.API_CONFIGURATION= {
    organization: openAiConfig.ORGANIZATION_ID,
    apiKey:openAiConfig.SECRET_KEY
}

//openAiConfig.DEFAULT_CHAT_MODEL = 'gpt-3.5-turbo';
openAiConfig.DEFAULT_CHAT_MODEL = 'gpt-4';

openAiConfig.DEFAULT_EMBEDDING_MODEL = 'text-embedding-ada-002';

const pricingList = {
    'gpt-3.5-turbo':{
        input:0.0015,
        output:0.002
    },
    'gpt-4':{
        input:0.03,
        output:0.06
    },

}

openAiConfig.MODEL_COST_INPUT=pricingList[openAiConfig.DEFAULT_CHAT_MODEL].input
openAiConfig.MODEL_COST_OUTPUT=pricingList[openAiConfig.DEFAULT_CHAT_MODEL].output
openAiConfig.MODEL_COST_TOKENS_DIVIDER=1000


openAiConfig.DEFAULT_TEMPERATURE=1
openAiConfig.DEFAULT_MAX_TOKENS=256
openAiConfig.DEFAULT_STREAM=false

module.exports= openAiConfig