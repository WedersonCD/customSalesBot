const fs = require('fs');
const csv = require('csv-parser');

const DATA_PATH='../../data';


//Generate unique Ids
export const generateUniqueId = () => {
    const timestamp = new Date().getTime().toString();
    const random = Math.random().toString().substring(2, 8);
    return timestamp + random;
}


export const getCsvAsArray = (fileName) => {

    const csvFilePath = `${DATA_PATH}/${fileName}.csv`;
    const csvData = [];

    fs.createReadStream(csvFilePath).pipe(csv()).on('data', (row) => {
            csvData.push(row);
    })

    return  csvData

}

export const getCurrentTimesTamp = ()=>{
    return new Date().getTime()
}

export const getCsvAsString = (fileName) =>{

    const csvFilePath = `${DATA_PATH}/${fileName}.csv`;

    return fs.readFileSync(csvFilePath,'utf-8')
}


