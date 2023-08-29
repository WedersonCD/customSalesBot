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

utils.storeObjectAsJsonFile = (object,filePath) =>{
    
    const JSONContent = JSON.stringify(object, null, 2);

    fs.writeFileSync(filePath, JSONContent, 'utf-8');
}


utils.getCopyOfArrayOfObjects= (array) =>{

    return array.map(obj => {
        return {... obj}
    })

}

utils.deletePropertieFromObjectsInArray =(array,propertie) =>{

    array.forEach(obj=>{
        utils.deletePropertieFromObject(obj,propertie)

    })

}

utils.getStringifyObjectWithOutSomeProperties = (object,properties)=>{
    
    let objectKey = {... object}
    properties.forEach((propertie)=>{
        utils.deletePropertieFromObject(objectKey,propertie)

    })

    objectKey=JSON.stringify(objectKey)

    return objectKey

}

utils.setSequencialIDToArrayOfObjects = (array,idName,idPrefix) =>{
    idPrefix = idPrefix || ''
    count=1
    array.map(obj=>{
        obj[idName]=idPrefix+count
        count+=1
    })

}

utils.getGroupPropertiesFromArrayOfObjects = (array, properties)=>{


    const mainDistinctObject={}

    array.forEach((obj)=>{
        tempObject= {... obj}
        const objectKey=utils.getStringifyObjectWithOutSomeProperties(tempObject,properties)

        if(mainDistinctObject[objectKey]){
            properties.forEach((propertie)=>{
                mainDistinctObject[objectKey][propertie+'_Array'].push(tempObject[propertie])

            })

        }else{
            mainDistinctObject[objectKey]=tempObject
            mainDistinctObject[objectKey]['groupedObjectKey']=objectKey

            properties.forEach((propertie)=>{
                mainDistinctObject[objectKey][propertie+'_Array']=[tempObject[propertie]]

            })

        }


    })

    const distinctArray=[]

    for(const objectKey in mainDistinctObject){

        properties.forEach((propertie)=>{
            mainDistinctObject[objectKey][propertie]=mainDistinctObject[objectKey][propertie+'_Array'].toString().replaceAll(',','/')

        })

        distinctArray.push(mainDistinctObject[objectKey])

    }

    return distinctArray

}

utils.getCsvAsArray = (filePath) => {

    const csvData = fs.readFileSync(filePath, 'utf-8');

    const lines = csvData.split('\n');
    const headers = lines[0].replace('\r','').split(',');
  
    //If the first value is the character 'zero-width no-break space' it must be removed.
    if(headers[0].charCodeAt(0)==65279){
      headers[0]=headers[0].slice(1)
    }
    
    const jsonArray = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const jsonEntry = {};
        for (let j = 0; j < headers.length; j++) {
            values[j] = values[j] || ''
            jsonEntry[headers[j]] = values[j].replace('\r','');
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