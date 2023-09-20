
const PRODUCSTS_PATH    ='../data/products/products.csv';
const utils             = require("../utils/utils")
const productsConfig    = require("../configs/productsConfig")
const openAIService    = require('../services/openAIService')

const products={
    raw:[],
    grouped:[],
}


const getRawProducts = ()=>{
    return utils.getCsvAsArray(PRODUCSTS_PATH)

}

const getRawProductFromIdArray = (productIdArray)=>{
    

    return products.raw.filter((product)=>productIdArray.includes(product[productsConfig.COLUMN_ID]))
    
}

const getGroupedProductsFromRawProduct = ()=>{

    const columnsToAgroup = productsConfig.COLUMN_TO_AGRUP

    const groupedProduct=utils.getGroupPropertiesFromArrayOfObjects(products.raw,columnsToAgroup)

    return groupedProduct
}

const saveGroupedProducts = ()=>{
    utils.storeObjectAsJsonFile(products.grouped,productsConfig.STORE_PATH+'/groupedProducts.json')

}

const getGroupedProductsEmbedding = async ()=>{
    
    const embeddingInputs =[] 

    products.grouped.forEach(groupedProduct=>{
        embeddingInputs.push(groupedProduct.groupedObjectKey.replaceAll('"','').replaceAll('{','').replaceAll('}','').replaceAll(',',', ').replaceAll(':',': '))
    })

    return await openAIService.getEmbeddigns(embeddingInputs)

}

const setGroupedProductsEmbeddings = async ()=>{
    const embeddingsArray = await getGroupedProductsEmbedding();

    for(position=0;position<products.grouped.length;position++){
        products.grouped[position].embeddings=embeddingsArray.data[position].embedding
    }

}

const getGroupedProducts = ()=>{
    return    utils.getJsonFileAsObject(productsConfig.STORE_PATH+'/groupedProducts.json')

}

const getRandomSampleOfGroupedProducts = (probabilityOfGetGroupedProduct)=>{
    const groupedProducts = getGroupedProducts();

    return groupedProducts.filter(value=>Math.random()<=probabilityOfGetGroupedProduct)

}

const getGroupedProductsFromId = (groupedProductId)=>{
    groupedIdArray = products.grouped.filter(value=>{
        return value[productsConfig.DISTINCT_ID_COLUMN]==groupedProductId
    })

    return groupedIdArray[0]

}


const getMoreSimilarGroupedProductsIds = (groupedProductId,qtd) =>{
    const groupedProduct= getGroupedProductsFromId(groupedProductId)
    const groupedProducts = getGroupedProducts();

    const arrayWithSimilarity = groupedProducts.map(groupedProductComparaded=>{
        
        return {
            groupedProducts:    groupedProductComparaded,
            similarity:         utils.similarityBetweenEmbeddings(groupedProduct.embeddings,groupedProductComparaded.embeddings)
        }
    })
    arrayWithSimilarity.sort((a,b)=>{
        return b.similarity - a.similarity
    })

    const filteredAray =arrayWithSimilarity.filter((value,index)=>index<qtd) 
    return filteredAray.map(value=>value.groupedProducts[productsConfig.DISTINCT_ID_COLUMN])

}


const teste = async (req,res)=>{
    const groupedProducts = getGroupedProducts();
    groupedProductPrincipal=groupedProducts[0]
        groupedProducts.forEach(groupedProductComparaded=>{
            similarity =utils.similarityBetweenEmbeddings(groupedProductPrincipal.embeddings,groupedProductComparaded.embeddings)

    })


    res.status(200).json({works:'ok'})

}

const setRawProducts = ()=>{
    products.raw=getRawProducts()
}

const setGroupedProducts =()=>{
    products.grouped = getGroupedProductsFromRawProduct()
}

const setGroupedProductsFromFile =()=>{
    products.grouped = getGroupedProducts()

}

const setGroupedProductsId = ()=>{
    utils.setSequencialIDToArrayOfObjects(products.grouped,productsConfig.DISTINCT_ID_COLUMN,productsConfig.DISTINCT_ID_PREFIX)

}

const generateGroupedProductsBase = async (req,res)=>{

    try{
        setRawProducts()
        setGroupedProducts()
        await setGroupedProductsEmbeddings()
        setGroupedProductsId()

        saveGroupedProducts()
        res.status(200).json({works:'ok'})

    }catch(error){
        console.log(error)
        res.status(500).json({error: error})
    }
}


const loadProductsBase = async (req,res)=>{

    try{
        setRawProducts()
        setGroupedProductsFromFile()
        res.status(200).json(products)

    }catch(error){
        console.log(error)
        res.status(500).json({error: error})
    }
}

module.exports = {
    generateGroupedProductsBase,
    getGroupedProducts,
    getMoreSimilarGroupedProductsIds,
    getRandomSampleOfGroupedProducts,
    getRawProductFromIdArray,
    loadProductsBase,
    getGroupedProductsFromId,
    teste
}