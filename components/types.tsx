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
    UnregisteredCropDetails: { userId: number; cropCount: number };
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
    SinProfile:undefined;
    TamProfile:undefined;
    SearchFarmer:{NICnumber: string; userId: any;};
    FarmerQr:{ cropCount: number,userId:any,NICnumber: string; };
    ComplainPage:{farmerName:any, farmerPhone:any, userId:number};
    OfficerQr:undefined;
    Profile:undefined;
    ReportPage:{userId:string,registeredFarmerId:Number};
    SearchPriceScreen:undefined;
    PriceChart: {
        varietyId: string;
        cropName: string;
        varietyName: string;
      };
   // Main:{screen: keyof RootStackParamList};
   Main: { screen: keyof RootStackParamList; params?: any };
    CollectionOfficersList:undefined;

    



    OfficerSummary: {
      officerId: string;
      officerName: string;
      phoneNumber1: string;
      phoneNumber2: string;
      collectionOfficerId:number;
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
      branchName: string
    }
    
    DailyTargetListForOfficers:{officerId:string,collectionOfficerId:number};
    EditTargetManager:undefined;
    PassTargetBetweenOfficers:undefined;
    RecieveTargetBetweenOfficers:undefined
    ManagerDashboard:undefined;
    CenterTarget:undefined;
    ManagerTransactions:undefined;
    

};

export type OfficerBasicDetailsFormData = {
  userId: string;
  firstNameEnglish: string;
  lastNameEnglish: string;
  firstNameSinhala: string;
  lastNameSinhala: string;
  firstNameTamil: string;
  lastNameTamil: string;
  profileImage:string
  nicNumber: string;
  email: string;
  jobRole:string;
};

