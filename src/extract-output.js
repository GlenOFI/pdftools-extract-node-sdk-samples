const path = require('path');
const fs = require('fs').promises;
const extract = require('extract-zip');


const fileDirectory = 'output'
const outFilePath = 'extracted';

(async function () {
  const directoryPath = path.join( __dirname, `../${fileDirectory}`);
  console.log(directoryPath)

  try{
      const files =  await fs.readdir(directoryPath);

      for(const fileName of files){
          console.log(fileName); 

          if(fileName.toLocaleLowerCase().indexOf('.zip') < 0) continue;
 
          const out = path.join( __dirname, `../${outFilePath}/${getFileNameWithoutExtension(fileName)}`);
          console.log(out);

          await extract(`${fileDirectory}/${fileName}`, { dir: out})
          console.log('Extraction complete')
      }
  }catch(err){
      console.log(err)
  }
})();

function getFileNameWithoutExtension(filePath){
  var filename = ''
  if(/\//.test(filePath)){
    // Between forward slash and last dot
    filename= /.*\/(.*)\..*/.exec(filePath)
  }
  else{
    // From start to last dot
    filename= /(.*)\..*/.exec(filePath)
  }

  return filename[1];
}