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

/**
 * This sample illustrates how to extract Text, Table Elements Information from PDF along with renditions of Figure,
 * Table elements.
 * <p>
 * Refer to README.md for instructions on how to run the samples & understand output zip file.
 */

try {
    // const fileName="640QSC0004-2130-SW-CP-0001_C-ScopeofWork-Copy.pdf";
    // const fileName="45-PL-EN-0014_1_IFU.pdf";
    const fileName="Electricity (Licensing) Regulations 1991 - [07-h0-01].pdf";

	// Initial setup, create credentials instance.
	const credentials =  ExtractPdfSdk.Credentials
		.serviceAccountCredentialsBuilder()
		.fromFile(`credentials/pdftools-api-credentials.json`)
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
    // .then(result => result.saveAsFile('output/extractTextTableInfoWithFiguresTablesRenditionsFromPdf.zip'))
    // .then(result => result.saveAsFile(`output/${fileName}.zip`))

	extractPDFOperation.execute(clientContext)
        .then(result => result.saveAsFile(`output/test`))
		.catch(err => console.log(err));
} catch (err) {
	console.log("Exception encountered while executing operation", err);
}
