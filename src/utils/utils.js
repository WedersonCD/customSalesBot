const fs = require('fs');


const utils ={}

//Generate unique Ids
utils.generateUniqueId = () => {
    const timestamp = new Date().getTime().toString();
    const random = Math.random().toString().substring(2, 8);
    return timestamp + random;
}

utils.deletePropertieFromObject = (obj,propertie) =>{
    delete obj[propertie]

}

utils.getDistinctArrayOfObjects = (array) =>{

    distinctArray = array.map((obj)=>JSON.stringify(obj))

    distinctArray = [... new Set(distinctArray)]

    return distinctArray.map(obj =>JSON.parse(obj))
}

utils.getStringifyObjectWithOutOnePropertie = (object,propertie)=>{
    
    let objectKey = {... object}
    utils.deletePropertieFromObject(objectKey,propertie)
    objectKey=JSON.stringify(objectKey)

    return objectKey

}


utils.getGroupPropertieFromArrayOfObjects = (array, propertie)=>{

    const mainDistinctObject={}

    array.forEach((obj)=>{
        tempObject= {... obj}
        const objectKey=utils.getStringifyObjectWithOutOnePropertie(tempObject,propertie)

        if(mainDistinctObject[objectKey]){
            mainDistinctObject[objectKey][propertie].push(tempObject[propertie])

        }else{
            mainDistinctObject[objectKey]=tempObject
            mainDistinctObject[objectKey][propertie]=[tempObject[propertie]]
            mainDistinctObject[objectKey]['groupedObjectKey']=objectKey

        }


    })

    const distinctObject=[]

    for(const objectKey in mainDistinctObject){
        mainDistinctObject[objectKey][propertie+'String']=mainDistinctObject[objectKey][propertie].toString().replace(',','/')
        distinctObject.push(mainDistinctObject[objectKey])
    }

    return distinctObject

}

utils.getCsvAsArray = (filePath) => {

    const csvData = fs.readFileSync(filePath, 'utf-8');

    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    
    const jsonArray = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const jsonEntry = {};
        for (let j = 0; j < headers.length; j++) {
            jsonEntry[headers[j]] = values[j];
        }
        jsonArray.push(jsonEntry);
    }

    return jsonArray

}

utils.getCurrentTimesTamp = () => {
    return new Date().getTime()
}

utils.getCsvStringFromArray = (jsonData) => {

    const fields = Object.keys(jsonData[0]);

    const csvRows = [fields.join(',')];

    jsonData.forEach(obj => {
        const values = fields.map(field => obj[field]);
        csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');

    return csvString;

}

utils.getCsvAsString = (path) => {

    const csvFilePath = path

    return fs.readFileSync(csvFilePath, 'utf-8')
}

module.exports = utils