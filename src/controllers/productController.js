
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

const getGroupedProductsFromRawProduct = (rawProduct)=>{
    groupedProduct=utils.getGroupPropertiesFromArrayOfObjects(rawProduct,[productsConfig.COLUMN_ID,productsConfig.COLUMN_COLOR])
    //utils.setSequencialIDToArrayOfObjects(groupedProduct,productsConfig.DISTINCT_ID_COLUMN,productsConfig.DISTINCT_ID_PREFIX)

    return groupedProduct
}

const saveGroupedProducts = (groupedProduct)=>{
    utils.storeObjectAsJsonFile(groupedProduct,productsConfig.STORE_PATH+'/groupedProducts.json')

}

const getGroupedProductsEmbedding = async (groupedProducts)=>{
    
    const embeddingInputs =[] 

    groupedProducts.forEach(groupedProduct=>{
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

const getMoreSimilarGroupedProducts = (groupedProduct,qtd) =>{

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

    return filteredAray.map(value=>value.groupedProducts)

}


const teste = async (req,res)=>{
    const groupedProducts = getGroupedProducts();
    console.log(groupedProducts.length)
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
    products.grouped = getGroupedProductsFromRawProduct(products.rawProduct)
}

const setGroupedProductsFromFile =()=>{
    products.grouped = getGroupedProducts()

}

const generateGroupedProductsBase = async (req,res)=>{

    try{
        products.raw =getRawProducts()
        setGroupedProducts()
        await setGroupedProductsEmbeddings()
        saveGroupedProducts(groupedProducts)
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
    getMoreSimilarGroupedProducts,
    getRandomSampleOfGroupedProducts,
    getRawProductFromIdArray,
    loadProductsBase,
    teste
}