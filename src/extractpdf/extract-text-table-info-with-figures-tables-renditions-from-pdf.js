/*
 * Copyright 2019 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

const ExtractPdfSdk = require('@adobe/pdftools-extract-node-sdk');

const path = require('path');
const fs = require('fs');

/**
 * This sample illustrates how to extract Text, Table Elements Information from PDF along with renditions of Figure,
 * Table elements.
 * <p>
 * Refer to README.md for instructions on how to run the samples & understand output zip file.
 */

const extractAsync = async () => {
    const directoryPath = path.join( __dirname, '../../OFISampleDocs');

    fs.readdir(directoryPath, async (err, files) => {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
            
        // Process in sequence to monitor file success or failure
        for(const fileName of files){
            console.log(fileName); 

            try {

                if(fileName.toLocaleLowerCase().indexOf('pdf') < 0) continue;

                // Initial setup, create credentials instance.
                const credentials =  ExtractPdfSdk.Credentials
                    .serviceAccountCredentialsBuilder()
                    .fromFile(`pdftools-api-credentials.json`)
                    .build();

                //Create a clientContext using credentials and create a new operation instance.
                const clientContext = ExtractPdfSdk.ExecutionContext
                        .create(credentials),
                    extractPDFOperation = ExtractPdfSdk.ExtractPDF.Operation
                        .createNew(),

                    // Set operation input from a source file.
                    // 'resources/extractPdfInput.pdf',
                    input = ExtractPdfSdk.FileRef.createFromLocalFile(
                        `OFISampleDocs/${fileName}`,
                        ExtractPdfSdk.ExtractPDF.SupportedSourceFormat.pdf
                    );

                extractPDFOperation.setInput(input);

                extractPDFOperation.addElementToExtract(ExtractPdfSdk.PDFElementType.TEXT);
                extractPDFOperation.addElementToExtract(ExtractPdfSdk.PDFElementType.TABLES);

                extractPDFOperation.addElementToExtractRenditions(ExtractPdfSdk.PDFElementType.FIGURES);
                extractPDFOperation.addElementToExtractRenditions(ExtractPdfSdk.PDFElementType.TABLES);

                // Execute the operation
                const result = await extractPDFOperation.execute(clientContext)
                    .catch (err => console.log("extractPDFOperation exception encountered while executing operation", err));;
                result.saveAsFile(`output/${fileName}.zip`)
            
            } catch (err) {
                console.log("Exception encountered while executing operation", err);
            }
        }
    })

}
extractAsync();