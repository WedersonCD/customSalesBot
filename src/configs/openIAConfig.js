
const openAiConfig = {};

openAiConfig.SECRET_KEY = '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';
openAiConfig.ORGANIZATION_ID='org-DcCBYIlOD6cf96VFX2fmRzpq';

openAiConfig.API_CONFIGURATION= {
    organization: openAiConfig.ORGANIZATION_ID,
    apiKey:openAiConfig.SECRET_KEY
}

openAiConfig.DEFAULT_CHAT_MODEL = 'gpt-3.5-turbo';
openAiConfig.DEFAULT_EMBEDDING_MODEL = 'text-embedding-ada-002';

openAiConfig.DEFAULT_TEMPERATURE=1
openAiConfig.DEFAULT_MAX_TOKENS=256
openAiConfig.DEFAULT_STREAM=false

module.exports= openAiConfig