const OpenAI = require('openai')
const fs = require('fs')

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
      "Women,Casual,Sandals,Slip-Ons,Zipper,EVA,White",
      "Women,Casual,Sneakers,High-Tops,Lace-up,Leather,Blue"
    ]
    });

//  console.log(embeddings.data);
  
}

const getCsvAsArray = (filePath) => {
  const csvData = fs.readFileSync(filePath, 'utf-8');

  const lines = csvData.split('\n');
  const headers = lines[0].replace('\r','').split(',');
  console.log(headers[0].charCodeAt(0))
  headers[0]=headers[0].slice(1)
  console.log(headers[0].charCodeAt(0))
  
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

//main();
console.log(getCsvAsArray('./data/products.csv'))