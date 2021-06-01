const path = require('path');
const fs = require('fs').promises;

const fileDirectory = 'output'
const inputFileName = 'Electricity (Licensing) Regulations 1991 - [07-h0-01].pdf.json'

async function readFile(filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    
    const data = JSON.parse(buffer.toString())

    const documentInfo = {
        name:inputFileName,
        pageCount: data.extended_metadata.page_count
    }

    const reducedElements = data.elements.map(element=> 
        {
            return {
                path: element.Path,
                text: element.Text,
                objectId: element.ObjectID,
                page: element.Page,
                filePaths: element.filePaths
            }
        }
    )

    const reducedData = {document: documentInfo, elements: reducedElements}
    console.log(JSON.stringify(reducedData, null, 2))
    
    return reducedData
  
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}

async function writeFile(fileDirectory, inputFileName, text) {
    try {
      await fs.writeFile(`${fileDirectory}/reduced_${inputFileName}`, text, { flag: 'w' });
    } catch (error) {
      console.error(`Got an error trying to write to a file: ${error.message}`);
    }
  }
  
(async function () {
    const directoryPath = path.join( __dirname, `../${fileDirectory}`);
    console.log(directoryPath)

    try{
        const files =  await fs.readdir(directoryPath);
            console.log('test')

        for(const fileName of files){
            console.log(fileName); 

            if(fileName.toLocaleLowerCase().indexOf('.json') < 0) continue;


            const reducedData = await readFile(`${fileDirectory}/${fileName}`);

            await writeFile(fileDirectory, fileName, JSON.stringify(reducedData, null, 2));
        }
    }catch(err){
        console.log(err)
    }
})();

