import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Keyboard,
  Image,
  Modal,
  Animated,
  ScrollView
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {environment }from '@/environment/environment';
import { useTranslation } from "react-i18next";

// Define props for the screen
type OTPverificationProps = {
  navigation: StackNavigationProp<RootStackParamList, "OTPverification">;
  route: RouteProp<RootStackParamList, "OTPverification">;
};

interface userItem {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  NICnumber: string;
  district: string;
 

}




const OTPverification: React.FC<OTPverificationProps> = ({ navigation, route }) => {
  const {         
    firstName,
    lastName,
    NICnumber,

    district,
   } = route.params;
  // Extract phone number from route params
  const { phoneNumber } = route.params;

  // State management
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
      const [modalVisible, setModalVisible] = useState(false);
       const [isModalVisible, setIsModalVisible] = useState(false); // Success modal visibility state
      const [referenceId, setReferenceId] = useState<string | null>(null);
      const [otpCode, setOtpCode] = useState<string>("");
       const [isVerified, setIsVerified] = useState<boolean>(false);
        const [unsuccessfulProgress] = useState(new Animated.Value(0)); // Animated value for unsuccessful loading bar
const [progress] = useState(new Animated.Value(0)); // Animated value for progress


   const [isUnsuccessfulModalVisible, setIsUnsuccessfulModalVisible] = useState(false); // Unsuccessful modal visibility state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages

  const otpInputs = useRef<(TextInput | null)[]>([]);
  // Handle OTP input change
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus to next input
    if (text.length === 1 && index < 4) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  // Handle backspace to move to previous input
  const handleBackspace = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join(""); // Convert OTP array to string
    
    if (code.length !== 5) {
      Alert.alert(
        t("Otpverification.invalidOTP"),
        t("Otpverification.completeOTP")
      );
      return;
    }
  
    setLoading(true); // Set loading state
    
    try {
      const refId = referenceId;
      
      if (!refId) {
        throw new Error("Reference ID not found");
      }
  
      const data: userItem = {
        phoneNumber: parseInt(phoneNumber, 10),
        firstName: firstName,
        lastName: lastName,
        NICnumber: NICnumber,
        district: district,
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
  
      console.log("Sending verification request:", body);
  
      // OTP Verification
      const response = await axios.post(url, body, { headers });
      console.log("Verification Response:", response.data);
  
      // Check OTP verification status
      if (response.data && response.data.statusCode === "1000") {
        try {
          // Backend registration
          const registrationResponse = await axios.post(
            `${environment.API_BASE_URL}api/farmer/farmer-register`,
            data
          );
  
          // Success: Show modal and navigate
          setIsVerified(true);
          setIsModalVisible(true);
  
          // Navigate after a short delay
          setTimeout(() => {
            setIsModalVisible(false);
            navigation.navigate("OTPSuccess" as any, {
              NICnumber: registrationResponse.data.NICnumber,
              userId: registrationResponse.data.userId,
            });
          }, 2000); // 2 seconds delay to show success modal
        } catch (registrationError) {
          // Backend registration failed
          console.error("Registration Error:", registrationError);
          setIsUnsuccessfulModalVisible(true);
          setErrorMessage(t("Error.registrationFailed"));
        }
      } else {
        // OTP Verification Failed
        setIsUnsuccessfulModalVisible(true);
        setErrorMessage(t("OtpVerification.verificationFailed"));
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setIsUnsuccessfulModalVisible(true);
      setErrorMessage(t("Error.somethingWentWrong"));
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  // const handleVerify = async () => {
  //   const code = otp.join(""); 
    
  //   if (code.length !== 5) {
  //     Alert.alert(
  //       t("Otpverification.invalidOTP"),
  //       t("Otpverification.completeOTP")
  //     );
  //     return;
  //   }
  
  //   setLoading(true);
    
  //   try {
  //     const refId = referenceId;
      
  //     if (!refId) {
  //       throw new Error("Reference ID not found");
  //     }
  
  //     const data: userItem = {
  //       phoneNumber: parseInt(phoneNumber, 10),
  //       firstName: firstName,
  //       lastName: lastName,
  //       NICnumber: NICnumber,
  //       district: district,
  //     };
  
  //     // OTP Verification
  //     const response = await axios.post(
  //       "https://api.getshoutout.com/otpservice/verify", 
  //       {
  //         code: code,
  //         referenceId: refId,
  //       }, 
  //       {
  //         headers: {
  //           Authorization: `Apikey ${environment.SHOUTOUT_API_KEY}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  
  //     if (response.data && response.data.statusCode === "1000") {
  //       // Backend registration
  //       const registrationResponse = await axios.post(
  //         `${environment.API_BASE_URL}api/farmer/farmer-register`,
  //         data
  //       );
  
  //       // Animate progress to 100%
  //       Animated.timing(progress, {
  //         toValue: 100,
  //         duration: 1500, // 1.5 seconds
  //         useNativeDriver: false,
  //       }).start(() => {
  //         // After animation completes, navigate
  //         setIsModalVisible(true);
  //         setTimeout(() => {
  //           navigation.navigate("OTPSuccess" as any, {
  //             NICnumber: registrationResponse.data.NICnumber,
  //             userId: registrationResponse.data.userId,
  //           });
  //         }, 500); // Short delay to ensure modal is visible
  //       });
  //     } else {
  //       // OTP Verification Failed
  //       setIsUnsuccessfulModalVisible(true);
  //       setErrorMessage(t("OtpVerification.verificationFailed"));
  //     }
  //   } catch (error) {
  //     console.error("Verification Error:", error);
  //     setIsUnsuccessfulModalVisible(true);
  //     setErrorMessage(t("Error.somethingWentWrong"));
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  useEffect(() => {
    const getReferenceId = async () => {
      const refId = await AsyncStorage.getItem("referenceId");
      if (refId) {
        setReferenceId(refId);
      }
    };
    getReferenceId();
  }, []);
  
  // Resend OTP
  const handleResendOTP = async () => {
    if (resendDisabled) return;

    try {
      setLoading(true);
      setResendDisabled(true);
      setTimer(60);
      setOtp(["", "", "", "", ""]); // Clear OTP input

      const apiUrl = "https://api.getshoutout.com/otpservice/send";
      const headers = {
        Authorization: `Apikey ${environment.SHOUTOUT_API_KEY}`,
        "Content-Type": "application/json",
      };

      const body = {
        source: "ShoutDEMO",
        transport: "sms",
        content: { sms: "Your verification code is {{code}}" },
        destination: phoneNumber,
      };

      const response = await axios.post(apiUrl, body, { headers });

      if (response.data.referenceId) {
       
        await AsyncStorage.setItem("referenceId", response.data.referenceId);
        Alert.alert("Success", "OTP resent successfully.");
      } else {
        throw new Error("Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
      setResendDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  // Timer Effect
  useEffect(() => {
    const interval = timer > 0 
      ? setInterval(() => setTimer(prev => prev - 1), 1000)
      : undefined;

    if (timer === 0) {
      setResendDisabled(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const loadingBarWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const unsuccessfulLoadingBarWidth = unsuccessfulProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
       <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
              >
      <View className="flex-1 px-6 py-8 items-center">
        {/* Verification Icon */}
        <View className=" rounded-full items-center justify-center mb-6">
          {/* <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center">
            <View className="w-16 h-16 bg-white/30 rounded-full items-center justify-center">
              <Text className="text-white text-2xl">🔐</Text>
            </View>
          </View> */}
          <Image
                    source={require("../../assets/images/sucsse.webp")}
                    className="h-[150px] w-[150px] rounded-lg"
                    resizeMode="contain"
                  />
        </View>

        {/* Title and Phone Number */}
        <Text className="text-2xl font-bold mb-4">Enter Verification Code</Text>
        <Text className="text-[#0085FF] text-base mb-8 mt-2">{phoneNumber}</Text>

        {/* OTP Input Fields */}
        <View className="flex-row space-x-3 mb-6 mt-[8%]">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) otpInputs.current[index] = ref;
              }}
              className="w-12 h-12 border border-[#0CB783] rounded-lg text-center text-xl"
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={({ nativeEvent }) => 
                handleBackspace(nativeEvent.key, index)
              }
              editable={!loading}
            />
          ))}
        </View>

        {/* Resend OTP Section */}
        <View className="mb-6">
  <Text className="text-[#707070] text-base mb-2">
    I didn't receive the code!
  </Text>
  <TouchableOpacity     
  onPress={handleResendOTP}     
  disabled={resendDisabled}
  className="items-center "  // This will center the text horizontally
>     
  <Text className={`font-bold text-base ${resendDisabled ? 'text-gray-400' : 'text-[#2AAD7A]'}`}>       
    {timer > 0 ? `Resend in ${timer}s` : 'Resend'}     
  </Text>   
</TouchableOpacity>
</View>

        {/* Verify Button */}
        <TouchableOpacity
          className={`rounded-full py-3 w-full mt-8  ${loading ? 'bg-[#2AAD7A]' : 'bg-[#2AAD7A]'}`}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text className="text-white text-center text-lg font-bold">
            {loading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>
 <Modal transparent={true} visible={isModalVisible} animationType="slide">
              {/* <View className="flex-1 justify-center items-center bg-gray-100 bg-opacity-50"> */}
              <View 
      className="flex-1 justify-center items-center" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
                <View className="bg-white rounded-lg w-72 p-6 items-center">
                  <Text className="text-xl font-bold mb-4"> {t("UnregisteredFarmerDetails.Success")}</Text>
                  <View className="mb-4">
                    <Image
                      source={require("../../assets/images/tick.webp")} // Replace with your own checkmark image
                      className="w-24 h-24"
                    />
                  </View>
                  <Text className="text-gray-700">{t("UnregisteredFarmerDetails.Successful")}</Text>
                  <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-6">
                    <Animated.View
                      className="h-full bg-green-500"
                      style={{ width: loadingBarWidth }}
                    />
                  </View>
                </View>
              </View>
            </Modal>
      
            <Modal
              transparent={true}
              visible={isUnsuccessfulModalVisible}
              animationType="slide"
            >
              {/* <View className="flex-1 justify-center items-center bg-gray-100 bg-opacity-50"> */}
              <View 
      className="flex-1 justify-center items-center" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
                <View className="bg-white rounded-lg w-72 p-6 items-center">
                  <Text className="text-xl font-bold mb-4">{t("UnregisteredFarmerDetails.Oops")}</Text>
                  <View className="mb-4">
                    <Image
                      source={require("../../assets/images/error.webp")} // Replace with your own error image
                      className="w-24 h-24"
                    />
                  </View>
                  <Text className="text-gray-700">{t("UnregisteredFarmerDetails.Unsuccessful")}</Text>
      
                  {/* Display error message */}
                  {errorMessage && (
                    <Text className="text-red-600 text-center mt-2">
                      {errorMessage}
                    </Text>
                  )}
      
                  {/* Red Loading Bar */}
                  <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-6">
                    <Animated.View
                      className="h-full bg-red-500"
                      style={{ width: unsuccessfulLoadingBarWidth }}
                    />
                  </View>
      
                  <TouchableOpacity
                    className="bg-red-500 p-2 rounded-full mt-4"
                    onPress={() => {
                      setIsUnsuccessfulModalVisible(false);
                      setErrorMessage(null); // Clear error message when closing
                      unsuccessfulProgress.setValue(0); // Reset animation value when closing
                    }}
                  >
                    <Text className="text-white">{t("UnregisteredFarmerDetails.Close")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
       
        
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OTPverification;