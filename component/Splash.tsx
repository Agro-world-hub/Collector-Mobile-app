import { View, Text, Image } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types'; // Adjust the import path as needed
import { useDispatch } from "react-redux";
import { setUser } from '../store/authSlice';

type SplashNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

interface SplashProps {
  navigation: SplashNavigationProp;
}

const phone = require('../assets/images/phone.webp');
const Center = require('../assets/images/CODINET expanded logo colored.png');
const Bottom = require('../assets/images/Group 35 (1).png');
const Top = require('../assets/images/Group 34 (3).png');
const Splash: React.FC<SplashProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const checkTokenAndNavigate = async () => {
      try {
        
        await handleTokenCheck();
        // Check for token in AsyncStorage
      } catch (error) {
        console.error('Error checking token or job role:', error);
        // Fallback to language screen if there's an error
        setTimeout(() => {
          navigation.navigate('Lanuage');
        }, 10000);
      }
    };

    checkTokenAndNavigate();
  }, [navigation]);

  const handleTokenCheck = async () => {
    try {
      const expirationTime = await AsyncStorage.getItem("tokenExpirationTime");
      const userToken = await AsyncStorage.getItem("token");
      const role = await  AsyncStorage.getItem("jobRole");
      const emp = await AsyncStorage.getItem("empid");
dispatch(setUser({ token: userToken ?? '', jobRole: role ?? '', empId: emp ?? '' }));
      if (expirationTime && userToken) {
        const currentTime = new Date();
        const tokenExpiry = new Date(expirationTime);

        if (currentTime < tokenExpiry) {
          console.log("Token is valid, navigating to Main.");
          const jobRole = await AsyncStorage.getItem('jobRole');
          if (jobRole === "Collection Officer") {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main', params: { screen: 'Dashboard' } }]
            });
          } else if (jobRole === "Collection Manager") {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main', params: { screen: 'ManagerDashboard' } }]
            })
          }else if (jobRole==="Distribution Officer" || "Distribution Manager"){
            console.log("hit dis manager")
             navigation.reset({
              index: 0,
              routes: [{ name: 'Main', params: { screen: 'DistridutionaDashboard' } }]
            })
          }
                } else {
          console.log("Token expired, clearing storage.");
          await AsyncStorage.multiRemove([
            "token",
            "tokenStoredTime",
            "tokenExpirationTime",
          ]);
          navigation.navigate("Lanuage");
        }
      } else {
        navigation.navigate("Lanuage");
      }
    } catch (error) {
      console.error("Error checking token expiration:", error);
      navigation.navigate("Lanuage");
    }
  };


  return (
    <View className='bg-[#2AAD7A] w-full flex-1'>
     <View className='flex-1'>
      <Image source={phone} className='mt-[50%]' />
      </View>
      <View className='items-center pb-[10%]'>
      <Text className='text-white text-2xl'>POWERED BY POLYGON</Text>
      </View>
    </View>


  );
}

export default Splash;

// import { View, Image, Text } from 'react-native';
// import React, { useEffect , useState} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from './types'; // Adjust the import path as needed
// import * as Progress from "react-native-progress";

// type SplashNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

// interface SplashProps {
//   navigation: SplashNavigationProp;
// }

// const phone = require('../assets/images/phone.webp');
// const Center = require('../assets/images/CODINET expanded logo colored.png');
// const Bottom = require('../assets/images/Group 35 (1).png');
// const Top = require('../assets/images/Group 34 (3).png');

// const Splash: React.FC<SplashProps> = ({ navigation }) => {

//     const [progress, setProgress] = useState(0);

//   // Function to check the token and navigate accordingly

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       // Only navigate after token check and progress bar completion
//       handleTokenCheck();
//     }, 5000);
//       const progressInterval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev < 1) {
//           return prev + 0.1;
//         }
//         clearInterval(progressInterval);
//         return prev;
//       });
//     }, 500);

//     return () => {
//       clearTimeout(timer);
//       clearInterval(progressInterval);
//     };
//   }, [navigation]);

//   const handleTokenCheck = async () => {
//     try {
//       const expirationTime = await AsyncStorage.getItem("tokenExpirationTime");
//       const userToken = await AsyncStorage.getItem("token");

//       if (expirationTime && userToken) {
//         const currentTime = new Date();
//         const tokenExpiry = new Date(expirationTime);

//         if (currentTime < tokenExpiry) {
//           console.log("Token is valid, navigating to Main.");
//           const jobRole = await AsyncStorage.getItem('jobRole');
          
//           if (jobRole === "Collection Officer") {
//             navigation.reset({
//               index: 0,
//               routes: [{ name: 'Main', params: { screen: 'Dashboard' } }]
//             });
//           } else {
//             navigation.reset({
//               index: 0,
//               routes: [{ name: 'Main', params: { screen: 'ManagerDashboard' } }]
//             });
//           }
//         } else {
//           console.log("Token expired, clearing storage.");
//           await AsyncStorage.multiRemove([
//             "token",
//             "tokenStoredTime",
//             "tokenExpirationTime",
//           ]);
//           navigation.navigate("Lanuage");
//         }
//       } else {
//         navigation.navigate("Lanuage");
//       }
//     } catch (error) {
//       console.error("Error checking token expiration:", error);
//       navigation.navigate("Lanuage");
//     }
//   };

//   // // Display the splash screen for 20 seconds
//   // useEffect(() => {
//   //   const timeout = setTimeout(() => {
//   //     // After 20 seconds, check the token and navigate accordingly
//   //     handleTokenCheck();
//   //   }, 5000); // 20 seconds delay

//   //   return () => clearTimeout(timeout); // Clean up the timeout on unmount
//   // }, [navigation]);

//   return (
//     <View className="flex-1 bg-white relative justify-center">
//       <Image
//         source={Top} 
//         className="w-[50%] h-[18%] absolute left-0 top-0"
//         resizeMode="contain"
//       />
//       <Image
//         source={Center} 
//         className="w-full h-32 justify-center items-center"
//         resizeMode="contain"
//       />
//       <Text className="text-center text-[10px] mt-2">
//         POWERED BY POLYGON
//       </Text>
//       <View style={{ width: '80%', marginTop: 20, marginLeft: '10%' }} >
//         <Progress.Bar
//           progress={progress}
//           width={null}
//           color="#8C0876"
//           borderWidth={0}
//           style={{ height: 10, marginTop: 20 }}
//         />
//       </View>
//       <Image
//         source={Bottom} 
//         className="w-[50%] h-[18%] absolute bottom-0 right-0"
//         resizeMode="contain"
//       />
//     </View>
//   );
// };

// export default Splash;
