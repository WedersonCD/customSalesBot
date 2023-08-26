
const OPEN_IA_SECRET_KEY = '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';
const OPEN_IA_ORGANIZATION_ID='org-DcCBYIlOD6cf96VFX2fmRzpq';

const OPEN_IA_API_CONFIGURATION= {
    organization: OPEN_IA_ORGANIZATION_ID,
    apiKey:OPEN_IA_SECRET_KEY
}

const OPEN_IA_DEFAULT_MODEL = 'gpt-3.5-turbo';
const OPEN_IA_DEFAULT_TEMPERATURE=1
const OPEN_AI_DEFAULT_MAX_TOKENS=256
const OPEN_AI_DEFAULT_STREAM=true

export default {
    OPEN_IA_API_CONFIGURATION,
    OPEN_IA_DEFAULT_MODEL,
    OPEN_IA_DEFAULT_TEMPERATURE,
    OPEN_AI_DEFAULT_MAX_TOKENS,
    OPEN_AI_DEFAULT_STREAM
}