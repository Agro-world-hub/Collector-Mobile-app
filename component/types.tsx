export type RootStackParamList = {
  BottomNav:undefined
    Splash:undefined;
    Login:undefined;
    ChangePassword:undefined;
    Registeredfarmer:undefined;
    Ufarmercropdetails:undefined;
    Dashboard:undefined;
    QRScanner:{userId:any};
    FormScreen: { scannedData: any };
    EngProfile:undefined;
    UnregisteredFarmerDetails:{ cropCount: 1, userId:number };
    //UnregisteredCropDetails: { cropCount: number, userId:number };
    UnregisteredCropDetails: { userId: number; cropCount: number, farmerPhone: number, farmerLanguage: string; };
    SinChangePassword:undefined;
    SinLogin:undefined;
    Lanuage:undefined;
    SinDashboard:undefined;
    SinUfarmercropdetails:undefined;
    SinUnregisteredCropDetails: { cropCount: number };
    SinUnregisteredFarmerDetails:undefined;
    SinRegisteredfarmer:undefined;
    TamChangePassword:undefined;
    TamLogin:undefined;
    TamDashboard:undefined;
    TamRegisteredfarmer:undefined;
    TamUfarmercropdetails:undefined;
    TamUnregisteredFarmerDetails:undefined;
    TamUnregisteredCropDetails:{ cropCount: number,userId:any };
    TransportComponent:undefined;
    SinProfile:undefined;
    TamProfile:undefined;
    SearchFarmer:{NICnumber: string; userId: any;};
    FarmerQr:{ cropCount: number,userId:any,NICnumber: string; };
    ComplainPage:{farmerName:any, farmerPhone:any, userId:number, farmerLanguage:string};
    OfficerQr:undefined;
    Profile:undefined;
    ReportPage:{userId:string,registeredFarmerId:Number};
    SearchPriceScreen:undefined;
    PrivacyPolicy:undefined;
    PriceChart: {
        varietyId: string;
        cropName: string;
        varietyName: string;
      };
   // Main:{screen: keyof RootStackParamList};
   Main: { screen: keyof RootStackParamList; params?: any };
    CollectionOfficersList:undefined;
    RegisterDriver:undefined;
    AddVehicleDetails: {
      basicDetails:OfficerBasicDetailsFormData;
      jobRole: string;
      empType: string;
      preferredLanguages: string[];
      addressDetails:FormData;
      type: 'Permanent' | 'Temporary';
    };
    AddDriverAddressDetails: {
      formData: {
        // Basic details from previous screen, type inferred from the route.params destructuring
        [key: string]: any;
      };
      type: string;
      preferredLanguages: string[];
      jobRole: string;
    };
  
    

  
  
    

    



    OfficerSummary: {
      officerId: string;
      officerName: string;
      phoneNumber1: string;
      phoneNumber2: string;
      collectionOfficerId:number;
      image:string;
    };
    ReportGenerator:{officerId:string,collectionOfficerId:number};
    DailyTargetList:undefined;
    ComplainHistory:undefined;
    AddOfficerBasicDetails:undefined;
    AddOfficerAddressDetails: {
      formData: OfficerBasicDetailsFormData;
      type: 'Permanent' | 'Temporary';
      preferredLanguages: {
        Sinhala: boolean;
        English: boolean;
        Tamil: boolean;
      };
      jobRole: string;
    };
    ClaimOfficer:undefined;
    TransactionList:undefined;
    FarmerReport:{
      registeredFarmerId: number;
      userId: number;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      address: string;
      NICnumber: string;
      totalAmount: number;
      bankAddress: string | null;
      accountNumber: string | null;
      accountHolderName: string | null;
      bankName: string | null;
      branchName: string | null;
      selectedDate: string;
      empId: string;
    };
    SetTargetScreen:{fromDate:string,toDate:string,fromTime:string,toTime:string};
    DailyTarget:undefined;
    TargetValidPeriod:undefined;
    NoCollectionCenterScreen:undefined;
    EditTargetScreen:undefined;
    PassTargetScreen:undefined;
    RecieveTargetScreen:undefined;

    OTPE:{
      firstName: string;
      lastName: string;
      phoneNumber: string;
      NICnumber: string;
      district: string;
      accNumber: string;
      accHolderName: string;
      bankName: string;
      branchName: string;
      PreferdLanguage: string;
    }
    
    NewReport:{userId:any,registeredFarmerId:number};
    TransactionReport:{ registeredFarmerId: number;
      userId: number;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      address: string;
      NICnumber: string;
      totalAmount: number;
      bankAddress: string | null;
      accountNumber: string | null;
      accountHolderName: string | null;
      bankName: string | null;
      branchName: string | null;
      selectedDate: string;
      selectedTime: string;
      empId: string;};
    
    DailyTargetListForOfficers:{officerId:string,collectionOfficerId:number};
    EditTargetManager:undefined;
    PassTargetBetweenOfficers:undefined;
    RecieveTargetBetweenOfficers:undefined
    ManagerDashboard:undefined;
    CenterTarget:undefined;
    ManagerTransactions:undefined;

    SearchFarmerScreen:undefined;
    //RegisterFarmer:undefined;
    RegisterFarmer: { NIC: string };
    OTPverification: {
      firstName: string;
      lastName: string;
      NICnumber: string;
      accNumber: string;
      accHolderName: string;
      bankName: string;
      branchName: string
      phoneNumber: string;
      district: string;
      PreferdLanguage: string;
    };
    CollectionRequestForm: { NICnumber: string ; id: number };
    CollectionRequests: { requestId: number ; crops:string };  // expect requestId in CollectionRequests
  ViewScreen: { requestId: number ; crops:string  };  // expect requestId in ViewScreen
  Cancelreson:{requestId : number , status: string};
  UpdateFarmerBankDetails: {
    id: number;
    NICnumber: string;
  };
  ReviewCollectionRequests: {
    cropsList: any[];
    address: {
      buildingNo: string;
      streetName: string;
      city: string;
      routeNumber: string;
    };
    scheduleDate: string;
    farmerId: number;
  };
  otpBankDetailsupdate :{
    accNumber: string;
    accHolderName: string;
    bankName: string;
    branchName: string
    phoneNumber: string;
    PreferdLanguage: string;
    farmerId:number;
    officerRole:string
  };

  DistridutionaDashboard:undefined;
  TargetOrderScreen:undefined;
//OpenedOrderScreen:{item: string ,centerCode:string};
 PendingOrderScreen: {
  item: any; // or define proper OrderItem interface
  centerCode: string;
  status?: 'Pending' | 'Opened' | 'Completed' | 'In Progress';
};

CompletedOrderScreen:{item: string ,centerCode:string};
};

export interface OrderItem {
  invoiceNo: string;
  varietyNameEnglish: string;
  grade: string;
  target: number;
  complete: number;
  todo: number;
  status: string;
  completedTime?: string | null;
  // Add any other properties that your order item has
}


export type OfficerBasicDetailsFormData = {
  userId: string;
  firstNameEnglish: string;
  lastNameEnglish: string;
  firstNameSinhala?: string;
  lastNameSinhala?: string;
  firstNameTamil?: string;
  lastNameTamil?: string;
  nicNumber: string;
  email: string;
  jobRole: string;
  phoneCode1: string;
  phoneNumber1: string;
  phoneCode2?: string;
  phoneNumber2?: string;
  profileImage?: string;
  
  
};

