const OpenAI = require('openai')
const fs = require('fs')
const similarity = require('compute-cosine-similarity')

const OPEN_IA_SECRET_KEY = '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';
const OPEN_IA_ORGANIZATION_ID='org-DcCBYIlOD6cf96VFX2fmRzpq';

const OPEN_IA_API_CONFIGURATION= {
  organization: OPEN_IA_ORGANIZATION_ID,
  apiKey:OPEN_IA_SECRET_KEY
}


const openai = new OpenAI(OPEN_IA_API_CONFIGURATION);

async function main() {

  const embeddings = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: [
      "apostas de e-sport",
      "travesti comendo cachorro quente no rio de janeiro enquanto de prostitui"
    ]
    });

  console.log(embeddings);

  console.log(similarity(embeddings.data[0].embedding,embeddings.data[1].embedding))
  
}

const getCsvAsArray = (filePath) => {     
  const csvData = fs.readFileSync(filePath, 'utf-8');

  const lines = csvData.split('\n');
  const headers = lines[0].replace('\r','').split(',');

  //If the first value is the character 'zero-width no-break space' he HAVE to be removed.
  if(headers[0].charCodeAt(0)==65279){
    headers[0]=headers[0].slice(1)
  }
  
  const jsonArray = [];
  for (let i = 1; i < 2; i++) {
      const values = lines[i].split(',');
      const jsonEntry = {};
      for (let j = 0; j < headers.length; j++) {
          jsonEntry[headers[j]] = values[j].replace('\r','');
      }
      jsonArray.push(jsonEntry);
  }

  return jsonArray

}

main();
//console.log(getCsvAsArray('./data/products.csv'))