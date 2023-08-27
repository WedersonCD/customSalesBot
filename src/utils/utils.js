const fs = require('fs');



//Generate unique Ids
const generateUniqueId = () => {
    const timestamp = new Date().getTime().toString();
    const random = Math.random().toString().substring(2, 8);
    return timestamp + random;
}


const getCsvAsArray = (filePath) => {

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

const getCurrentTimesTamp = () => {
    return new Date().getTime()
}

const getCsvStringFromArray = (jsonData) => {

    const fields = Object.keys(jsonData[0]);

    const csvRows = [fields.join(',')];

    jsonData.forEach(obj => {
        const values = fields.map(field => obj[field]);
        csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');

    return csvString;

}

const getCsvAsString = (path) => {

    const csvFilePath = path

    return fs.readFileSync(csvFilePath, 'utf-8')
}

module.exports = {
    generateUniqueId,
    getCsvAsArray,
    getCurrentTimesTamp,
    getCsvAsString,
    getCsvStringFromArray
}
