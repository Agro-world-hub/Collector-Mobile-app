// import RNFetchBlob from 'rn-fetch-blob';
// import { PDFDocument, PageSizes, rgb } from 'react-native-pdf-lib';
// import ViewShot from 'react-native-view-shot';
// import { Alert } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
// import React from 'react';

// // Capture QR Codes as PNG images for the PDF
// const captureQrCode = async (value: string): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     <ViewShot
//       style={{ width: 100, height: 100 }}
//       options={{ format: 'png', quality: 1.0 }}
//       onCapture={(uri) => resolve(uri)}
//       onError={(error) => reject(error)}
//     >
//       <QRCode value={value} size={100} />
//     </ViewShot>
//   });
// };

// // Main function to generate the PDF
// export const generatePdf = async (personalDetails:any, bankDetails:any) => {
//   try {
//     // Capture QR codes for farmer and officer
//     const farmerQrUri = await captureQrCode('farmer-qr-code');
//     const officerQrUri = await captureQrCode('officer-qr-code');

//     // Define PDF path and document
//     const pdfPath = `${RNFetchBlob.fs.dirs.DocumentDir}/PurchaseReport.pdf`;
//     const pdfDoc = await PDFDocument.create(pdfPath).addPages(
//       PDFDocument.Page.create({
//         width: PageSizes.A4.width,
//         height: PageSizes.A4.height,
//       })
//         // Title
//         .drawText('Purchase Report', {
//           x: 50,
//           y: PageSizes.A4.height - 60,
//           fontSize: 24,
//           color: rgb(0, 0, 0),
//         })

//         // Personal Details Table Header
//         .drawText('Personal Details', { x: 50, y: PageSizes.A4.height - 100, fontSize: 18, color: rgb(0, 0, 0) })
//         .drawLine({
//           start: { x: 50, y: PageSizes.A4.height - 105 },
//           end: { x: 500, y: PageSizes.A4.height - 105 },
//           color: rgb(0.5, 0.5, 0.5),
//         })

//         // Personal Details Rows
//         .drawText('First Name:', { x: 50, y: PageSizes.A4.height - 130, fontSize: 14 })
//         .drawText(personalDetails.firstName, { x: 200, y: PageSizes.A4.height - 130, fontSize: 14 })
//         .drawLine({ start: { x: 50, y: PageSizes.A4.height - 135 }, end: { x: 500, y: PageSizes.A4.height - 135 }, color: rgb(0.85, 0.85, 0.85) })

//         .drawText('Last Name:', { x: 50, y: PageSizes.A4.height - 155, fontSize: 14 })
//         .drawText(personalDetails.lastName, { x: 200, y: PageSizes.A4.height - 155, fontSize: 14 })
//         .drawLine({ start: { x: 50, y: PageSizes.A4.height - 160 }, end: { x: 500, y: PageSizes.A4.height - 160 }, color: rgb(0.85, 0.85, 0.85) })

//         .drawText('NIC Number:', { x: 50, y: PageSizes.A4.height - 180, fontSize: 14 })
//         .drawText(personalDetails.nicNumber, { x: 200, y: PageSizes.A4.height - 180, fontSize: 14 })
//         .drawLine({ start: { x: 50, y: PageSizes.A4.height - 185 }, end: { x: 500, y: PageSizes.A4.height - 185 }, color: rgb(0.85, 0.85, 0.85) })

//         .drawText('Phone Number:', { x: 50, y: PageSizes.A4.height - 205, fontSize: 14 })
//         .drawText(personalDetails.phoneNumber, { x: 200, y: PageSizes.A4.height - 205, fontSize: 14 })
//         .drawLine({ start: { x: 50, y: PageSizes.A4.height - 210 }, end: { x: 500, y: PageSizes.A4.height - 210 }, color: rgb(0.85, 0.85, 0.85) })

//         .drawText('Address:', { x: 50, y: PageSizes.A4.height - 230, fontSize: 14 })
//         .drawText(personalDetails.address, { x: 200, y: PageSizes.A4.height - 230, fontSize: 14 })
//         .drawLine({ start: { x: 50, y: PageSizes.A4.height - 235 }, end: { x: 500, y: PageSizes.A4.height - 235 }, color: rgb(0.85, 0.85, 0.85) })

//         // Bank Details Table Header
//         .drawText('Bank Details', { x: 50, y: PageSizes.A4.height - 270, fontSize: 18, color: rgb(0, 0, 0) })
//         .drawLine({ start: { x: 50, y: PageSizes.A4.height - 275 }, end: { x: 500, y: PageSizes.A4.height - 275 }, color: rgb(0.5, 0.5, 0.5) })

//         // Bank Details Rows
//         .drawText('Account Number:', { x: 50, y: PageSizes.A4.height - 300, fontSize: 14 })
//         .drawText(bankDetails.accountNumber, { x: 200, y: PageSizes.A4.height - 300, fontSize: 14 })
//         .drawLine({ start: { x: 50, y: PageSizes.A4.height - 305 }, end: { x: 500, y: PageSizes.A4.height - 305 }, color: rgb(0.85, 0.85, 0.85) })

//         .drawText('Account Holder:', { x: 50, y: PageSizes.A4.height - 325, fontSize: 14 })
//         .drawText(bankDetails.accountHolder, { x: 200, y: PageSizes.A4.height - 325, fontSize: 14 })
//         .drawLine({ start: { x: 50, y: PageSizes.A4.height - 330 }, end: { x: 500, y: PageSizes.A4.height - 330 }, color: rgb(0.85, 0.85, 0.85) })

//         .drawText('Bank Name:', { x: 50, y: PageSizes.A4.height - 350, fontSize: 14 })
//         .drawText(bankDetails.bankName, { x: 200, y: PageSizes.A4.height - 350, fontSize: 14 })
//         .drawLine({ start: { x: 50, y: PageSizes.A4.height - 355 }, end: { x: 500, y: PageSizes.A4.height - 355 }, color: rgb(0.85, 0.85, 0.85) })

//         .drawText('Branch Name:', { x: 50, y: PageSizes.A4.height - 375, fontSize: 14 })
//         .drawText(bankDetails.branchName, { x: 200, y: PageSizes.A4.height - 375, fontSize: 14 })
//         .drawLine({ start: { x: 50, y: PageSizes.A4.height - 380 }, end: { x: 500, y: PageSizes.A4.height - 380 }, color: rgb(0.85, 0.85, 0.85) })

//         // QR Codes
//         .drawText('QR Codes:', { x: 50, y: PageSizes.A4.height - 420, fontSize: 18, color: rgb(0, 0, 0) })
//         .drawImage(farmerQrUri, 'png', { x: 50, y: PageSizes.A4.height - 500, width: 100, height: 100 })
//         .drawImage(officerQrUri, 'png', { x: 180, y: PageSizes.A4.height - 500, width: 100, height: 100 })
//     );

//     await pdfDoc.write();
//     Alert.alert('PDF Generated', `PDF saved to: ${pdfPath}`);
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     Alert.alert('Error', 'Failed to generate PDF');
//   }
// };
