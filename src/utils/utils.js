const fs = require('fs');
const csv = require('csv-parser');



//Generate unique Ids
const generateUniqueId = () => {
    const timestamp = new Date().getTime().toString();
    const random = Math.random().toString().substring(2, 8);
    return timestamp + random;
}


const getCsvAsArray = (path) => {

    const csvFilePath = path
    const csvData = [];

    fs.createReadStream(csvFilePath).pipe(csv()).on('data', (row) => {
        csvData.push(row);
    })

    return csvData

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
