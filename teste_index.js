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
    model: 'gpt-3.5-turbo',
    stream: false,
    temperature: 1,
    max_tokens: 256,
    messages: [
      {
        role: 'system',
        content: "Você é um vendedor de sapatos jovem e descontraído da STZ. Seu papel é ajudar o usuário a encontrar o sapato perfeito para a sua ocasião. Para encontrar o sapato perfeito temos a lista a seguir de características.  Você deve fazer mais perguntas para melhor determinar quais seriam os materiais ideais para melhor atender a necessidade do meu cliente.  Quando souber quais são os modelos a resposta deve iniciar com '! ' e apenas conter os modelos no formato {Modelo1,modelo2}.Voce esta atendendo um cliente com as seguintes caracteristicas: Nome wederson genero masculino idade 25.Caso não consiga determinar uma boa opção envie esse link para falar com uma pessoa no Whatsapp: www.google.com.br\n" +
          'Segue a listagem:\n' +
          ' SKU,Segmento,Subsegmento,Grupo,Subgrupo,Tipo,Solado,Cor\r\n' +
          '12345,Men,Casual,Sneakers,High-Tops,Lace-up,Rubber,Black\r\n' +
          '67890,Women,Athletic,Sandals,Slip-Ons,Buckle,Leather,White\r\n' +
          '54321,Kids,Formal,Boots,Ankle,Zipper,EVA,Brown\r\n' +
          '98765,Men,Casual,Sneakers,High-Tops,Buckle,Leather,Blue\r\n' +
          '23456,Women,Athletic,Sandals,Slip-Ons,Zipper,EVA,Red\r\n' +
          '34567,Kids,Formal,Boots,Oxfords,Lace-up,Rubber,Black\r\n' +
          '45678,Men,Athletic,Boots,Ankle,Zipper,Rubber,Brown\r\n' +
          '56789,Women,Casual,Sneakers,High-Tops,Lace-up,Leather,Blue\r\n' +
          '78901,Kids,Athletic,Sandals,Slip-Ons,Buckle,Leather,White\r\n' +
          '89012,Men,Casual,Boots,Oxfords,Zipper,EVA,Red\r\n' +
          '23456,Women,Formal,Flats,Ankle,Lace-up,Rubber,Brown\r\n' +
          '34567,Kids,Casual,Sneakers,High-Tops,Lace-up,Leather,Black\r\n' +
          '45678,Men,Formal,Flats,Oxfords,Buckle,Leather,Blue\r\n' +
          '56789,Women,Casual,Sandals,Slip-Ons,Zipper,EVA,White\r\n' +
          '67890,Kids,Formal,Boots,Ankle,Rubber,Leather,Red\r\n' +
          '78901,Men,Formal,Flats,Oxfords,Lace-up,Rubber,Brown\r\n' +
          '89012,Women,Casual,Sneakers,High-Tops,Buckle,EVA,Black\r\n' +
          '90123,Kids,Formal,Flats,Ankle,Zipper,Leather,Blue\r\n' +
          '34567,Men,Formal,Flats,Oxfords,Zipper,EVA,Red\r\n' +
          '45678,Women,Athletic,Sandals,Slip-Ons,Buckle,Rubber,White'
      },
      {role: 'user', content: 'Gostaria de um sapato social' }
    ]
  });

  console.log(completion.choices);
  
}

main();