const OpenAI = require('openai')

const OPEN_IA_SECRET_KEY = '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';
const OPEN_IA_ORGANIZATION_ID='org-DcCBYIlOD6cf96VFX2fmRzpq';

const OPEN_IA_API_CONFIGURATION= {
  organization: OPEN_IA_ORGANIZATION_ID,
  apiKey:OPEN_IA_SECRET_KEY
}


const openai = new OpenAI(OPEN_IA_API_CONFIGURATION);

console.log(OpenAI.Embeddings.embeddings_utils )

async function main() {

  const embeddings = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: [
      "Women,Casual,Sandals,Slip-Ons,Zipper,EVA,White",
      "Women,Casual,Sneakers,High-Tops,Lace-up,Leather,Blue"
    ]
    });

//  console.log(embeddings.data);
  
}

main();