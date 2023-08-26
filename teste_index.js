const OpenAI = require('openai')

const OPEN_IA_SECRET_KEY = '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';
const OPEN_IA_ORGANIZATION_ID='org-DcCBYIlOD6cf96VFX2fmRzpq';

const OPEN_IA_API_CONFIGURATION= {
  organization: OPEN_IA_ORGANIZATION_ID,
  apiKey:OPEN_IA_SECRET_KEY
}


const openai = new OpenAI(OPEN_IA_API_CONFIGURATION);

async function main() {

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo'
  });

  console.log(completion.response);
  
}

main();