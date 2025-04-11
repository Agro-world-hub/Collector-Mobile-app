// import React, { useState, useRef, useEffect } from "react";
// import { 
//   View, 
//   Text, 
//   KeyboardAvoidingView, 
//   Platform, 
//   TextInput, 
//   TouchableOpacity, 
//   Alert,
//   Keyboard,
//   Image,
//   Modal,
//   Animated,
//   ScrollView
// } from "react-native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RootStackParamList } from "../types";
// import { RouteProp } from "@react-navigation/native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {environment }from '@/environment/environment';
// import { useTranslation } from "react-i18next";

// // Define props for the screen
// type OTPverificationProps = {
//   navigation: StackNavigationProp<RootStackParamList, "OTPverification">;
//   route: RouteProp<RootStackParamList, "OTPverification">;
// };

// interface userItem {
//   firstName: string;
//   lastName: string;
//   phoneNumber: number;
//   NICnumber: string;
//   district: string;
 

// }




// const OTPverification: React.FC<OTPverificationProps> = ({ navigation, route }) => {
//   const {         
//     firstName,
//     lastName,
//     NICnumber,

//     district,
//    } = route.params;
//   // Extract phone number from route params
//   const { phoneNumber } = route.params;

//   // State management
//   const [otp, setOtp] = useState(["", "", "", "", ""]);
//   const [timer, setTimer] = useState(60);
//   const [resendDisabled, setResendDisabled] = useState(false);
//   const [loading, setLoading] = useState(false);
//     const { t } = useTranslation();
//       const [modalVisible, setModalVisible] = useState(false);
//        const [isModalVisible, setIsModalVisible] = useState(false); // Success modal visibility state
//       const [referenceId, setReferenceId] = useState<string | null>(null);
//       const [otpCode, setOtpCode] = useState<string>("");
//        const [isVerified, setIsVerified] = useState<boolean>(false);
//         const [unsuccessfulProgress] = useState(new Animated.Value(0)); // Animated value for unsuccessful loading bar
// const [progress] = useState(new Animated.Value(0)); // Animated value for progress


//    const [isUnsuccessfulModalVisible, setIsUnsuccessfulModalVisible] = useState(false); // Unsuccessful modal visibility state
//   const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages

//   const otpInputs = useRef<(TextInput | null)[]>([]);
//   // Handle OTP input change
//   const handleOtpChange = (text: string, index: number) => {
//     const newOtp = [...otp];
//     newOtp[index] = text;
//     setOtp(newOtp);

//     // Auto focus to next input
//     if (text.length === 1 && index < 4) {
//       otpInputs.current[index + 1]?.focus();
//     }
//   };

//   // Handle backspace to move to previous input
//   const handleBackspace = (key: string, index: number) => {
//     if (key === 'Backspace' && otp[index] === '' && index > 0) {
//       otpInputs.current[index - 1]?.focus();
//     }
//   };

//   const handleVerify = async () => {
//     const code = otp.join(""); // Convert OTP array to string
    
//     if (code.length !== 5) {
//       Alert.alert(
//         t("Otpverification.invalidOTP"),
//         t("Otpverification.completeOTP")
//       );
//       return;
//     }
  
//     setLoading(true); // Set loading state
    
//     try {
//       const refId = referenceId;
      
//       if (!refId) {
//         throw new Error("Reference ID not found");
//       }
  
//       const data: userItem = {
//         phoneNumber: parseInt(phoneNumber, 10),
//         firstName: firstName,
//         lastName: lastName,
//         NICnumber: NICnumber,
//         district: district,
//       };
  
//       // Shoutout verify endpoint
//       const url = "https://api.getshoutout.com/otpservice/verify";
//       const headers = {
//         Authorization: `Apikey ${environment.SHOUTOUT_API_KEY}`,
//         "Content-Type": "application/json",
//       };
  
//       const body = {
//         code: code,
//         referenceId: refId,
//       };
  
//       console.log("Sending verification request:", body);
  
//       // OTP Verification
//       const response = await axios.post(url, body, { headers });
//       console.log("Verification Response:", response.data);
  
//       // Check OTP verification status
//       if (response.data && response.data.statusCode === "1000") {
//         try {
//           // Backend registration
//           const registrationResponse = await axios.post(
//             `${environment.API_BASE_URL}api/farmer/farmer-register`,
//             data
//           );
  
//           // Success: Show modal and navigate
//           setIsVerified(true);
//           setIsModalVisible(true);
  
//           // Navigate after a short delay
//           setTimeout(() => {
//             setIsModalVisible(false);
//             navigation.navigate("OTPSuccess" as any, {
//               NICnumber: registrationResponse.data.NICnumber,
//               userId: registrationResponse.data.userId,
//             });
//           }, 2000); // 2 seconds delay to show success modal
//         } catch (registrationError) {
//           // Backend registration failed
//           console.error("Registration Error:", registrationError);
//           setIsUnsuccessfulModalVisible(true);
//           setErrorMessage(t("Error.registrationFailed"));
//         }
//       } else {
//         // OTP Verification Failed
//         setIsUnsuccessfulModalVisible(true);
//         setErrorMessage(t("OtpVerification.verificationFailed"));
//       }
//     } catch (error) {
//       console.error("OTP Verification Error:", error);
//       setIsUnsuccessfulModalVisible(true);
//       setErrorMessage(t("Error.somethingWentWrong"));
//     } finally {
//       setLoading(false); // Ensure loading state is reset
//     }
//   };

//   // const handleVerify = async () => {
//   //   const code = otp.join(""); 
    
//   //   if (code.length !== 5) {
//   //     Alert.alert(
//   //       t("Otpverification.invalidOTP"),
//   //       t("Otpverification.completeOTP")
//   //     );
//   //     return;
//   //   }
  
//   //   setLoading(true);
    
//   //   try {
//   //     const refId = referenceId;
      
//   //     if (!refId) {
//   //       throw new Error("Reference ID not found");
//   //     }
  
//   //     const data: userItem = {
//   //       phoneNumber: parseInt(phoneNumber, 10),
//   //       firstName: firstName,
//   //       lastName: lastName,
//   //       NICnumber: NICnumber,
//   //       district: district,
//   //     };
  
//   //     // OTP Verification
//   //     const response = await axios.post(
//   //       "https://api.getshoutout.com/otpservice/verify", 
//   //       {
//   //         code: code,
//   //         referenceId: refId,
//   //       }, 
//   //       {
//   //         headers: {
//   //           Authorization: `Apikey ${environment.SHOUTOUT_API_KEY}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );
  
//   //     if (response.data && response.data.statusCode === "1000") {
//   //       // Backend registration
//   //       const registrationResponse = await axios.post(
//   //         `${environment.API_BASE_URL}api/farmer/farmer-register`,
//   //         data
//   //       );
  
//   //       // Animate progress to 100%
//   //       Animated.timing(progress, {
//   //         toValue: 100,
//   //         duration: 1500, // 1.5 seconds
//   //         useNativeDriver: false,
//   //       }).start(() => {
//   //         // After animation completes, navigate
//   //         setIsModalVisible(true);
//   //         setTimeout(() => {
//   //           navigation.navigate("OTPSuccess" as any, {
//   //             NICnumber: registrationResponse.data.NICnumber,
//   //             userId: registrationResponse.data.userId,
//   //           });
//   //         }, 500); // Short delay to ensure modal is visible
//   //       });
//   //     } else {
//   //       // OTP Verification Failed
//   //       setIsUnsuccessfulModalVisible(true);
//   //       setErrorMessage(t("OtpVerification.verificationFailed"));
//   //     }
//   //   } catch (error) {
//   //     console.error("Verification Error:", error);
//   //     setIsUnsuccessfulModalVisible(true);
//   //     setErrorMessage(t("Error.somethingWentWrong"));
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
  
//   useEffect(() => {
//     const getReferenceId = async () => {
//       const refId = await AsyncStorage.getItem("referenceId");
//       if (refId) {
//         setReferenceId(refId);
//       }
//     };
//     getReferenceId();
//   }, []);
  
//   // Resend OTP
//   const handleResendOTP = async () => {
//     if (resendDisabled) return;

//     try {
//       setLoading(true);
//       setResendDisabled(true);
//       setTimer(60);
//       setOtp(["", "", "", "", ""]); // Clear OTP input

//       const apiUrl = "https://api.getshoutout.com/otpservice/send";
//       const headers = {
//         Authorization: `Apikey ${environment.SHOUTOUT_API_KEY}`,
//         "Content-Type": "application/json",
//       };

//       const body = {
//         source: "ShoutDEMO",
//         transport: "sms",
//         content: { sms: "Your verification code is {{code}}" },
//         destination: phoneNumber,
//       };

//       const response = await axios.post(apiUrl, body, { headers });

//       if (response.data.referenceId) {
       
//         await AsyncStorage.setItem("referenceId", response.data.referenceId);
//         Alert.alert("Success", "OTP resent successfully.");
//       } else {
//         throw new Error("Failed to resend OTP");
//       }
//     } catch (error) {
//       console.error("Resend OTP Error:", error);
//       Alert.alert("Error", "Failed to resend OTP. Please try again.");
//       setResendDisabled(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Timer Effect
//   useEffect(() => {
//     const interval = timer > 0 
//       ? setInterval(() => setTimer(prev => prev - 1), 1000)
//       : undefined;

//     if (timer === 0) {
//       setResendDisabled(false);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [timer]);

//   const loadingBarWidth = progress.interpolate({
//     inputRange: [0, 100],
//     outputRange: ["0%", "100%"],
//   });

//   const unsuccessfulLoadingBarWidth = unsuccessfulProgress.interpolate({
//     inputRange: [0, 100],
//     outputRange: ["0%", "100%"],
//   });

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       className="flex-1 bg-white"
//     >
//        <ScrollView
//                 contentContainerStyle={{ flexGrow: 1 }}
//                 keyboardShouldPersistTaps="handled"
//               >
//       <View className="flex-1 px-6 py-8 items-center">
//         {/* Verification Icon */}
//         <View className=" rounded-full items-center justify-center mb-6">
//           {/* <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center">
//             <View className="w-16 h-16 bg-white/30 rounded-full items-center justify-center">
//               <Text className="text-white text-2xl">🔐</Text>
//             </View>
//           </View> */}
//           <Image
//                     source={require("../../assets/images/sucsse.webp")}
//                     className="h-[150px] w-[150px] rounded-lg"
//                     resizeMode="contain"
//                   />
//         </View>

//         {/* Title and Phone Number */}
//         <Text className="text-2xl font-bold mb-4">Enter Verification Code</Text>
//         <Text className="text-[#0085FF] text-base mb-8 mt-2">{phoneNumber}</Text>

//         {/* OTP Input Fields */}
//         <View className="flex-row space-x-3 mb-6 mt-[8%]">
//           {otp.map((digit, index) => (
//             <TextInput
//               key={index}
//               ref={(ref) => {
//                 if (ref) otpInputs.current[index] = ref;
//               }}
//               className="w-12 h-12 border border-[#0CB783] rounded-lg text-center text-xl"
//               keyboardType="numeric"
//               maxLength={1}
//               value={digit}
//               onChangeText={(text) => handleOtpChange(text, index)}
//               onKeyPress={({ nativeEvent }) => 
//                 handleBackspace(nativeEvent.key, index)
//               }
//               editable={!loading}
//             />
//           ))}
//         </View>

//         {/* Resend OTP Section */}
//         <View className="mb-6">
//   <Text className="text-[#707070] text-base mb-2">
//     I didn't receive the code!
//   </Text>
//   <TouchableOpacity     
//   onPress={handleResendOTP}     
//   disabled={resendDisabled}
//   className="items-center "  // This will center the text horizontally
// >     
//   <Text className={`font-bold text-base ${resendDisabled ? 'text-gray-400' : 'text-[#2AAD7A]'}`}>       
//     {timer > 0 ? `Resend in ${timer}s` : 'Resend'}     
//   </Text>   
// </TouchableOpacity>
// </View>

//         {/* Verify Button */}
//         <TouchableOpacity
//           className={`rounded-full py-3 w-full mt-8  ${loading ? 'bg-[#2AAD7A]' : 'bg-[#2AAD7A]'}`}
//           onPress={handleVerify}
//           disabled={loading}
//         >
//           <Text className="text-white text-center text-lg font-bold">
//             {loading ? 'Verifying...' : 'Verify'}
//           </Text>
//         </TouchableOpacity>
//  <Modal transparent={true} visible={isModalVisible} animationType="slide">
//               {/* <View className="flex-1 justify-center items-center bg-gray-100 bg-opacity-50"> */}
//               <View 
//       className="flex-1 justify-center items-center" 
//       style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
//     >
//                 <View className="bg-white rounded-lg w-72 p-6 items-center">
//                   <Text className="text-xl font-bold mb-4"> {t("UnregisteredFarmerDetails.Success")}</Text>
//                   <View className="mb-4">
//                     <Image
//                       source={require("../../assets/images/tick.webp")} // Replace with your own checkmark image
//                       className="w-24 h-24"
//                     />
//                   </View>
//                   <Text className="text-gray-700">{t("UnregisteredFarmerDetails.Successful")}</Text>
//                   <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-6">
//                     <Animated.View
//                       className="h-full bg-green-500"
//                       style={{ width: loadingBarWidth }}
//                     />
//                   </View>
//                 </View>
//               </View>
//             </Modal>
      
//             <Modal
//               transparent={true}
//               visible={isUnsuccessfulModalVisible}
//               animationType="slide"
//             >
//               {/* <View className="flex-1 justify-center items-center bg-gray-100 bg-opacity-50"> */}
//               <View 
//       className="flex-1 justify-center items-center" 
//       style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
//     >
//                 <View className="bg-white rounded-lg w-72 p-6 items-center">
//                   <Text className="text-xl font-bold mb-4">{t("UnregisteredFarmerDetails.Oops")}</Text>
//                   <View className="mb-4">
//                     <Image
//                       source={require("../../assets/images/error.webp")} // Replace with your own error image
//                       className="w-24 h-24"
//                     />
//                   </View>
//                   <Text className="text-gray-700">{t("UnregisteredFarmerDetails.Unsuccessful")}</Text>
      
//                   {/* Display error message */}
//                   {errorMessage && (
//                     <Text className="text-red-600 text-center mt-2">
//                       {errorMessage}
//                     </Text>
//                   )}
      
//                   {/* Red Loading Bar */}
//                   <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-6">
//                     <Animated.View
//                       className="h-full bg-red-500"
//                       style={{ width: unsuccessfulLoadingBarWidth }}
//                     />
//                   </View>
      
//                   <TouchableOpacity
//                     className="bg-red-500 p-2 rounded-full mt-4"
//                     onPress={() => {
//                       setIsUnsuccessfulModalVisible(false);
//                       setErrorMessage(null); // Clear error message when closing
//                       unsuccessfulProgress.setValue(0); // Reset animation value when closing
//                     }}
//                   >
//                     <Text className="text-white">{t("UnregisteredFarmerDetails.Close")}</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </Modal>
       
        
//       </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default OTPverification;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {environment }from '@/environment/environment';
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";
import { Modal } from "react-native";
import { Animated } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ScrollView } from "react-native-gesture-handler";

const { width: screenWidth } = Dimensions.get("window");

type RootStackParamList = {
  OtpVerification: undefined;
  NextScreen: undefined;
};

interface userItem {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  NICnumber: string;
  district: string;
  accNumber: string;
  accHolderName: string;
  bankName: string;
  branchName: string;
  PreferdLanguage: string;

}
interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
}
const ShowSuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose }) => {
  const progress = useRef(new Animated.Value(0)).current; // Start from 0
  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      progress.setValue(0); // Reset progress
      Animated.timing(progress, {
        toValue: 100, // Full progress
        duration: 2000, // Adjust timing
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => {
          onClose(); // Auto-close after completion
        }, 500);
      });
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-2xl items-center w-72 h-80 shadow-lg relative">
          <Text className="text-xl font-bold mt-4 text-center"> {t("Otpverification.Success")}</Text>

          <Image source={require("../../assets/images/success.webp")} style={{ width: 100, height: 100 }} />

          <Text className="text-gray-500 mb-4">{t("Otpverification.Registration")}</Text>

          <TouchableOpacity className="bg-[#2AAD7A] px-6 py-2 rounded-full mt-6" onPress={onClose}>
            <Text className="text-white font-semibold">{t("Otpverification.OK")}</Text>
          </TouchableOpacity>

          {/* Progress Bar - Fixed to Bottom */}
          <View className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 rounded-b-2xl overflow-hidden">
            <Animated.View
              style={{
                height: "100%",
                backgroundColor: "#2AAD7A",
                width: progress.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};


const Otpverification: React.FC = ({ navigation, route }: any) => {
  const {         
    firstName,
    lastName,
    NICnumber,
    phoneNumber,
    district,
    accNumber,
    accHolderName,
    bankName,
    branchName, 
    PreferdLanguage } = route.params;
  const [otpCode, setOtpCode] = useState<string>("");
  const [maskedCode, setMaskedCode] = useState<string>("XXXXX");
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(240);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [disabledResend, setDisabledResend] = useState<boolean>(true);
  const { t } = useTranslation();
  const [language, setLanguage] = useState("en");
  const [isOtpValid, setIsOtpValid] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);


  const inputRefs = useRef<TextInput[]>([]);
  


  
  useEffect(() => {
    const selectedLanguage = t("Otpverification.LNG");
    setLanguage(selectedLanguage);
    const fetchReferenceId = async () => {
      try {
        const refId = await AsyncStorage.getItem("referenceId");
        if (refId) {
          setReferenceId(refId);
        }
      } catch (error) {
        console.error("Failed to load referenceId:", error);
      }
    };

    fetchReferenceId();
  }, []);

  useEffect(() => {
    if (timer > 0 && !isVerified) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      setDisabledResend(true);

      return () => clearInterval(interval);
    } else if (timer === 0 && !isVerified) {
      setDisabledResend(false);
    }
  }, [timer, isVerified]);

  // const handleInputChange = (text: string) => {
  //   const sanitizedText = text.slice(0, 5);
  //   setOtpCode(sanitizedText);

  //   const masked = sanitizedText.padEnd(5, "X");
  //   setMaskedCode(masked);
  //   setIsOtpValid(sanitizedText.length === 5);
  // };
  const handleOtpChange = (text: string, index: number) => {
    // Update the OTP code based on input change
    const updatedOtpCode = otpCode.split(""); 
    updatedOtpCode[index] = text; // Modify the specific index
    setOtpCode(updatedOtpCode.join(""));

    // Check if OTP is valid (all 5 digits filled)
    setIsOtpValid(updatedOtpCode.length === 5 && !updatedOtpCode.includes(""));

    // Move to next input field if text is entered
    if (text && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const code = otpCode;

    if (code.length !== 5) {
      Alert.alert(
        t("Error.Sorry"),
        t("Otpverification.completeOTP")
      );
      return;
    }

    try {
      const refId = referenceId;

      const data: userItem = {
        phoneNumber: parseInt(phoneNumber, 10),
        firstName: firstName,
        lastName: lastName,
        NICnumber: NICnumber,
        district: district,
        accNumber: accNumber,
        accHolderName: accHolderName,
        bankName: bankName,
        branchName: branchName,
        PreferdLanguage: PreferdLanguage
      };
      // Shoutout verify endpoint
      const url = "https://api.getshoutout.com/otpservice/verify";
      const headers = {
        Authorization: `Apikey ${environment.SHOUTOUT_API_KEY}`,
        "Content-Type": "application/json",
      };

      const body = {
        code: code,
        referenceId: refId,
      };

      const response = await axios.post(url, body, { headers });
      const { statusCode } = response.data;

      if (statusCode === "1000") {
        setIsVerified(true);
        setModalVisible(true);

        const response1 = await axios.post(
          `${environment.API_BASE_URL}api/farmer/register-farmer`,
          data
        );
        await AsyncStorage.removeItem("referenceId");
        //Alert.alert("Success","Farmer Registration successful");
        <ShowSuccessModal visible={modalVisible} onClose={() => setModalVisible(false)} />
        navigation.navigate("SearchFarmerScreen" as any);     
       } else if (statusCode === "1001") {
        Alert.alert(
          t("Error.Sorry"),
          t("Otpverification.invalidOTP")
        );
      } else {
        Alert.alert(
          t("Error.Sorry"),
          t("Error.somethingWentWrong")
        );
      }
    } catch (error) {
      Alert.alert(
        t("Error.Sorry"),
        t("Error.somethingWentWrong")
      );
    }
  };

  
  // Resend OTP
  const handleResendOTP = async () => {
    await AsyncStorage.removeItem("referenceId");
    try {
      const apiUrl = "https://api.getshoutout.com/otpservice/send";
      const headers = {
        Authorization: `Apikey ${environment.SHOUTOUT_API_KEY}`,
        "Content-Type": "application/json",
      };

      let otpMessage = "";
      if(PreferdLanguage === "English"){
        otpMessage = `Your OTP for bank detail verification with XYZ is: {{code}}
        
${accHolderName}
${accNumber}
${bankName}
${branchName}
        
If correct, share OTP only with the XYZ representative who contacts you.`;

      }else if(PreferdLanguage === "Sinhala"){
        otpMessage = `XYZ සමඟ බැංකු විස්තර සත්‍යාපනය සඳහා ඔබගේ OTP: {{code}}
        
${accHolderName}
${accNumber}
${bankName}
${branchName}
        
නිවැරදි නම්, ඔබව සම්බන්ධ කර ගන්නා XYZ නියෝජිතයා සමඟ පමණක් OTP අංකය බෙදා ගන්න.`;
      }else if(PreferdLanguage === "Tamil"){
        otpMessage = `XYZ உடன் வங்கி விவர சரிபார்ப்புக்கான உங்கள் OTP: {{code}}
        
${accHolderName}
${accNumber}
${bankName}
${branchName}
        
சரியாக இருந்தால், உங்களைத் தொடர்பு கொள்ளும் XYZ பிரதிநிதியுடன் மட்டும் OTP ஐப் பகிரவும்.`;
      }
      const body = {
        source: "AgroWorld",
        transport: "sms",
        content: {
          sms: otpMessage,
        },
        destination: `${phoneNumber}`,
      };

      const response = await axios.post(apiUrl, body, { headers });

      if (response.data.referenceId) {
        await AsyncStorage.setItem("referenceId", response.data.referenceId);
        setReferenceId(response.data.referenceId);
        Alert.alert(
          t("Otpverification.Success"),
          t("Error.otpResent")
        );
        setTimer(240);
        setDisabledResend(true);
      } else {
        Alert.alert(
          t("Error.Sorry"),
          t("Error.otpResendFailed")
        );
      }
    } catch (error) {
      Alert.alert(
        t("Error.Sorry"),
        t("Error.otpResendFailed")
      );
    }
  };

  // Format the timer for display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const dynamicStyles = {
    imageWidth: screenWidth < 400 ? wp(28) : wp(35),
    imageHeight: screenWidth < 400 ? wp(28) : wp(28),
    margingTopForImage: screenWidth < 400 ? wp(1) : wp(16),
    margingTopForBtn: screenWidth < 400 ? wp(0) : wp(10),
  };

  return (

    <ScrollView
      className="flex-1 "
      style={{ paddingHorizontal: wp(4), paddingVertical: hp(2) }}
    >
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}  >
           <AntDesign name="left" size={22} color="#000" />
        </TouchableOpacity>
      </View>
      <View className="flex justify-center items-center mt-0">
        <Text className="text-black" style={{ fontSize: wp(8) }}>
          {/* {t("OtpVerification.OTPVerification")} */}
        </Text>
      </View>

      <View
        className="flex justify-center items-center"
        style={{ marginTop: dynamicStyles.margingTopForImage }}
      >
        <Image
          source={require("../../assets/images/otp.webp")}
          style={{
            width: dynamicStyles.imageWidth,
            height: dynamicStyles.imageHeight,
          }}
        />

<View className="">
          <Text className="mt-3 text-lg text-black text-center">
          {t("Otpverification.EnterCode")}
          </Text>
        </View>
        {language === "en" ? (
          <View className="mt-5">
            <Text className="text-md text-gray-400">
              {/* {t("OtpVerification.OTPCode")} */}
            </Text>
            <Text className="text-md text-[#0085FF] text-center pt-1 ">
              {phoneNumber}
            </Text>
          </View>
        ) : (
          <View className="mt-5">
            <Text className="text-md text-[#0085FF] text-center ">
              {phoneNumber}
            </Text>

            <Text className="text-md text-gray-400 pt-1">
              {/* {t("OtpVerification.OTPCode")} */}
            </Text>
          </View>
        )}

        {/* <View className="pt-6">
          <TextInput
            style={{
              width: wp(60),
              height: hp(7),
              textAlign: "center",
              fontSize: wp(6),
              letterSpacing: wp(6),
              borderBottomWidth: 1,
              borderBottomColor: "gray",
              color: "black",
            }}
            keyboardType="numeric"
            maxLength={5}
            value={otpCode}
            onChangeText={handleInputChange}
            placeholder={maskedCode}
            placeholderTextColor="lightgray"
          />
        </View> */}
        <View className="flex-row justify-center gap-3 mt-4 px-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el as TextInput)}
              className={`w-12 h-12 text-lg text-center rounded-lg ${
                otpCode[index] ? "bg-[#FFFFFF] text-black pb-2" : "bg-[#FFFFFF] text-black"
              }`}
              keyboardType="numeric"
              maxLength={1}
              value={otpCode[index] || ""}
              onChangeText={(text) => handleOtpChange(text, index)}
              placeholder={maskedCode[index] || "_"}
              placeholderTextColor="lightgray"
              style={{
                borderColor: "#0CB783",
                borderWidth: 2, // Adjust thickness if needed
              }}
            />
          ))}
        </View>

        {/* <View className="mt-10">
          <Text className="mt-3 text-lg text-black text-center">
            {t("OtpVerification.didntreceived")}
          </Text>
        </View> */}
        <View className="mt-5">
        <Text className="text-md text-[#707070] pt-1">
              {/* {t("OtpVerification.OTPCode")} */}
              {t("Otpverification.Didreceive")}
            </Text>
            </View>

        <View className="mt-1 mb-9">
          <Text
            className="mt-3 text-lg text-black text-center underline"
            onPress={disabledResend ? undefined : handleResendOTP}
            style={{ color: disabledResend ? "gray" : "blue" }}
          >
            {timer > 0
              ? `${t("Resend in ")} ${formatTime(timer)}`
              : `${t("Resend again")}`}
          </Text>
        </View>

        <ShowSuccessModal visible={modalVisible} onClose={() => setModalVisible(false)} />

        <View style={{ marginTop: dynamicStyles.margingTopForBtn }}>
          <TouchableOpacity
            style={{ height: hp(7), width: wp(80) }}
            className={`flex items-center justify-center mx-auto rounded-full ${
              !isOtpValid || isVerified ? "bg-[#2AAD7A]" : "bg-[#2AAD7A]"
            }`}
            onPress={handleVerify}
            disabled={isVerified}
          >
            <Text className="text-white text-lg">
              {/* {t("OtpVerification.Verify")} */}
              {t("Otpverification.Verify")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Otpverification;
