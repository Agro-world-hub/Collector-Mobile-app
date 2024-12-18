// ReportPDFGenerator.ts
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

export const handleGeneratePDF = async () => {
  try {
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Collection Officer Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 2px solid #ddd;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
          }
          h1 {
            text-align: center;
            margin-bottom: 10px;
          }
          .header {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
          }
          .header-item {
            width: 48%;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
          }
          .header-item span {
            display: inline-block;
            width: 48%;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          table th, table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
          }
          table th {
            background-color: #e0dbd4;
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            font-style: italic;
            font-size: 12px;
            text-align: center;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Collection Officer Report</h1>
          <p style="text-align: center; font-weight: bold;">ID NO : COO00127M012</p>
          
          <div class="header">
            <div class="header-item"><span>From</span><span>2024/01/05</span></div>
            <div class="header-item"><span>To</span><span>2024/01/10</span></div>
            <div class="header-item"><span>EMP ID</span><span>COO0125</span></div>
            <div class="header-item"><span>Role</span><span>Collection Officer</span></div>
            <div class="header-item"><span>First Name</span><span>Sam</span></div>
            <div class="header-item"><span>Last Name</span><span>Perera</span></div>
            <div class="header-item"><span>Weight</span><span>255kg</span></div>
            <div class="header-item"><span>Farmers</span><span>56</span></div>
          </div>

          <table>
            <tr><th>Date</th><th>Total Weight</th><th>Total Farmers</th></tr>
            <tr><td>2024/01/05</td><td>97kg</td><td>17</td></tr>
            <tr><td>2024/01/06</td><td>88kg</td><td>11</td></tr>
            <tr><td>2024/01/07</td><td>55kg</td><td>08</td></tr>
            <tr><td>2024/01/08</td><td>-No Data-</td><td>-No Data-</td></tr>
            <tr><td>2024/01/09</td><td>80kg</td><td>20</td></tr>
            <tr><td>2024/01/10</td><td>40kg</td><td>05</td></tr>
          </table>

          <div class="footer">This report is generated on 2024/02/01 at 11.45 AM</div>
        </div>
      </body>
      </html>
    `;
 // Generate PDF
 const { uri } = await Print.printToFileAsync({
  html: htmlContent,
  base64: false,
});

// Move the file to app document directory for easier access
const fileUri = `${FileSystem.documentDirectory}report.pdf`;
await FileSystem.moveAsync({
  from: uri,
  to: fileUri,
});

console.log('PDF generated at:', fileUri);
return fileUri;
} catch (error) {
console.error('Failed to generate PDF:', error);
return null;
}
};
