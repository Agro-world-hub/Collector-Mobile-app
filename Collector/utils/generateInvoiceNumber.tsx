import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import environment from "@/environment/environment";

const generateInvoiceNumber = async (): Promise<string | null> => {
  try {
    // Retrieve empId from AsyncStorage
    const empId = await AsyncStorage.getItem("empid");

    if (!empId) {
      console.error("Error: Employee ID not found in AsyncStorage");
      return null;
    }
  
    
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const currentDate = `${year}${month}${day}`;
    console.log('Employee ID:', empId);

    const response = await axios.get(
      `${environment.API_BASE_URL}api/report/invoice/latest/${empId}/${currentDate}`
    );

    let newSequenceNumber = '0001';
    
    console.log('Response in invoice:', response.data);

    if (response.data && response.data.invoiceNumber) {
      const lastInvoiceNumber = response.data.invoiceNumber;
      const lastSequence = parseInt(lastInvoiceNumber.slice(-4), 10);
      newSequenceNumber = String(lastSequence + 1).padStart(4, '0');
    }

    const invoiceNumber = `${empId}${currentDate}${newSequenceNumber}`;
    console.log('Generated Invoice Number:', invoiceNumber);

    return invoiceNumber;
  } catch (error) {
    console.error('Error generating invoice number:', error);
    return null;
  }
};

export default generateInvoiceNumber;
