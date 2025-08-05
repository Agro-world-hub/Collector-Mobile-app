import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "./types";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from 'react-native-vector-icons/Entypo'
import MdIcons from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { environment } from "../environment/environment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import DashedLine from 'react-native-dashed-line';
import generateInvoiceNumber from "@/utils/generateInvoiceNumber";
import CameraComponent from "@/utils/CameraComponent";
import { SelectList } from "react-native-dropdown-select-list";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

interface Crop {
  id: string;
  cropNameEnglish: string;
  cropNameSinhala: string;
  cropNameTamil: string;
}

// Define navigation and route props
type UnregisteredCropDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UnregisteredCropDetails"
>;
type UnregisteredCropDetailsRouteProp = RouteProp<
  RootStackParamList,
  "UnregisteredCropDetails"
>;

interface UnregisteredCropDetailsProps {
  navigation: UnregisteredCropDetailsNavigationProp;
  route: UnregisteredCropDetailsRouteProp;
}

const UnregisteredCropDetails: React.FC<UnregisteredCropDetailsProps> = ({
  navigation,
}) => {
  const [cropCount, setCropCount] = useState(1);
  const [cropNames, setCropNames] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [varieties, setVarieties] = useState<{ id: string; variety: string }[]>(
    []
  );
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [unitPrices, setUnitPrices] = useState<{
    [key: string]: number | null;
  }>({ A: null, B: null, C: null });
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    A: 0,
    B: 0,
    C: 0,
  });
  const [total, setTotal] = useState<number>(0);
  const [image, setImage] = useState<string | null>(null); // Store base64 image here
  const [crops, setCrops] = useState<any[]>([]);
  const [selectedVarietyName, setSelectedVarietyName] = useState<string | null>(
    null
  );
  console.log("se", selectedVarietyName);
  const [donebutton1visibale, setdonebutton1visibale] = useState(true);
  const [donebutton2visibale, setdonebutton2visibale] = useState(false);
  const [donebutton1disabale, setdonebutton1disabale] = useState(true);
  const [donebutton2disabale, setdonebutton2disabale] = useState(false);
  const [showCameraModels, setShowCameraModels] = useState(false);
  const [addbutton, setaddbutton] = useState(true);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [resetImage, setResetImage] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
    const [scrollPosition, setScrollPosition] = useState(0); // Track the current scroll position
  const [isAtStart, setIsAtStart] = useState(true); // Track if we're at the start of the list
  console.log(isAtStart)
  const [isAtEnd, setIsAtEnd] = useState(false); // Track if we're at the end of the list
 const [usedVarietyIds, setUsedVarietyIds] = useState<string[]>([]);
 const [exhaustedCrops, setExhaustedCrops] = useState<string[]>([]); 
const scrollToNext = () => {
  if (scrollViewRef.current) {
    const newPosition = scrollPosition + wp(70) + 20;
    scrollViewRef.current.scrollTo({ x: newPosition, animated: true });
    setScrollPosition(newPosition);
  }
};

const scrollToPrevious = () => {
  if (scrollViewRef.current) {
    const newPosition = scrollPosition - (wp(70) + 20);
    scrollViewRef.current.scrollTo({ x: newPosition, animated: true });
    setScrollPosition(newPosition);
  }
};
const onScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
  const contentOffsetX = event.nativeEvent.contentOffset.x;
  setScrollPosition(contentOffsetX);

  // Calculate current index based on scroll position
  const itemWidth = wp(70) + 20;
  const currentIndex = Math.round(contentOffsetX / itemWidth);

  setIsAtStart(currentIndex === 0);
  setIsAtEnd(currentIndex === crops.length - 1);
};
  const [images, setImages] = useState<{
    A: string | null;
    B: string | null;
    C: string | null;
  }>({
    A: null,
    B: null,
    C: null,
  });
  if (images.A != null) {
    console.log("A");
  }
  if (images.B != null) {
    console.log("B");
  }
  if (images.C != null) {
    console.log("C");
  }

  const route = useRoute<UnregisteredCropDetailsRouteProp>();
  const { userId, farmerPhone, farmerLanguage } = route.params;
  console.log(userId, farmerPhone);

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      // Clear search query every time screen comes into focus
      setResetImage(false);
    }, [])
  );

  const fetchSelectedLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem("@user_language"); // Get stored language
      setSelectedLanguage(lang || "en"); // Default to English if not set
    } catch (error) {
      console.error("Error fetching language preference:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchSelectedLanguage();
    };
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCropNames = async () => {
        try {
          // Get auth token from storage
          const token = await AsyncStorage.getItem("token"); // Adjust this to your token storage method

          // Add token to request headers
          const headers = {
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.get(
            `${environment.API_BASE_URL}api/unregisteredfarmercrop/get-crop-names`,
            { headers }
          );

          const uniqueCropNames = response.data.reduce(
            (
              acc: { cropNameEnglish: any }[],
              crop: { cropNameEnglish: any }
            ) => {
              if (
                !acc.some(
                  (item: { cropNameEnglish: any }) =>
                    item.cropNameEnglish === crop.cropNameEnglish
                )
              ) {
                acc.push(crop); // Push unique crop names
              }
              return acc;
            },
            []
          );

          setCropNames(uniqueCropNames);
        } catch (error) {
          console.error("Error fetching crop names:", error);
        }
      };

      fetchCropNames();
    }, []) // Empty dependency array to ensure the effect only depends on screen focus
  );

  // Modify the handleCropChange function to store all language versions
  const handleCropChange = async (crop: {
    id: string;
    cropNameEnglish: string;
    cropNameSinhala: string;
    cropNameTamil: string;
  }) => {
    // Set selected crop with all language names
    setSelectedCrop({
      id: crop.id,
      name:
        selectedLanguage === "en"
          ? crop.cropNameEnglish
          : selectedLanguage === "si"
          ? crop.cropNameSinhala
          : crop.cropNameTamil,
    });

    setSelectedVariety(null);
    setUnitPrices({ A: null, B: null, C: null });
    setQuantities({ A: 0, B: 0, C: 0 });

    try {
      const token = await AsyncStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const varietiesResponse = await api.get(
        `api/unregisteredfarmercrop/crops/varieties/${crop.id}`,
        { headers }
      );

      if (varietiesResponse.data && Array.isArray(varietiesResponse.data)) {
        setVarieties(
          varietiesResponse.data.map(
            (variety: {
              id: string;
              varietyEnglish: string;
              varietySinhala: string;
              varietyTamil: string;
            }) => ({
              id: variety.id,
              variety:
                selectedLanguage === "en"
                  ? variety.varietyEnglish
                  : selectedLanguage === "si"
                  ? variety.varietySinhala
                  : variety.varietyTamil,
            })
          )
        );
      } else {
        console.error("Varieties response is not an array or is empty.");
      }
    } catch (error) {
      console.error("Error fetching varieties:", error);
    }
  };

  const handleVarietyChange = async (varietyId: string) => {
    setSelectedVariety(varietyId); // Set the selected variety ID

    // Find the selected variety name by the ID
    const selectedVariety = varieties.find(
      (variety) => variety.id === varietyId
    );
    if (selectedVariety) {
      setSelectedVarietyName(selectedVariety.variety); // Store the name of the selected variety
    }

    try {
      const token = await AsyncStorage.getItem("token");
      // Send the selected varietyId to fetch unit prices
      // const pricesResponse = await api.get(`api/unregisteredfarmercrop/unitPrices/${varietyId}`);
      const pricesResponse = await api.get(
        `api/unregisteredfarmercrop/unitPrices/${varietyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );

      // Check if the response status is 404 (Not Found)
      if (pricesResponse.status === 404) {
        Alert.alert(
          t("Error.No Prices Available"),
          t("Error.Prices for the selected variety were not found.")
        );
        setUnitPrices({}); // Clear any previously set prices
        return; // Stop further execution
      }

      // Check if there are no prices in the response body
      if (pricesResponse.data && pricesResponse.data.length === 0) {
        // Show an alert if no prices are available
        Alert.alert(
          t("Error.No Prices Available"),
          t("Error.No prices are available for the selected variety.")
        );
        setUnitPrices({}); // Clear any previously set prices
        return; // Do not proceed with setting prices or calculating the total
      }

      const prices = pricesResponse.data.reduce((acc: any, curr: any) => {
        acc[curr.grade] = curr.price;
        return acc;
      }, {});

      setUnitPrices(prices);
      setShowCameraModels(true);
      calculateTotal(); // Recalculate total after setting prices
    } catch (error) {
      console.error("Error fetching unit prices for selected variety:", error);
      // You can handle other error cases here, for example:
      Alert.alert(t("Error.error"), t("Error.no any prices found"));
    }
  };

  const handleQuantityChange = (grade: string, value: string) => {
    const quantity = parseInt(value) || 0;
    if (quantity === 0) {
      setImages((prev) => ({
        ...prev,
        [grade]: null, // Reset the image for this grade
      }));
    }
    setQuantities((prev) => ({ ...prev, [grade]: quantity }));
    calculateTotal();
  };

  useEffect(() => {
    calculateTotal();
  }, [unitPrices, quantities]);

  const calculateTotal = () => {
    const totalPrice = Object.keys(unitPrices).reduce((acc, grade) => {
      const price = unitPrices[grade] || 0; // default to 0 if price is null
      const quantity = quantities[grade] || 0; // default to 0 if quantity is 0
      return acc + price * quantity;
    }, 0);
    setTotal(totalPrice);
    if (totalPrice != 0) {
      setaddbutton(false);
    }
  };

  const [resetCameraImage, setResetCameraImage] = useState(false);

  const incrementCropCount = async () => {
    if (quantities.A > 0 && !images.A) {
      alert("Please upload an image for Grade A before submitting.");
      return; // Stop submission if the condition is met
    } else if (quantities.B > 0 && !images.B) {
      alert("Please upload an image for Grade B before submitting.");
      return; // Stop submission if the condition is met
    } else if (quantities.C > 0 && !images.C) {
      alert("Please upload an image for Grade C before submitting.");
      return; // Stop submission if the condition is met
    }
    setaddbutton(true);
    setSelectedCrop(null);
    setSelectedVariety(null);
    setdonebutton2disabale(false);
    console.log("Incrementing crop count");
    setdonebutton1visibale(false);
    setdonebutton2visibale(true);
    if (!selectedCrop || !selectedVariety) {
      alert("Please select both a crop and a variety before adding.");
      return;
    }
setUsedVarietyIds(prev => [...prev, selectedVariety]);
    const newCrop = {
      cropId: selectedCrop.id || "",
      varietyId: selectedVariety || "",
      varietyName: selectedVarietyName,
      gradeAprice: unitPrices.A || 0,
      gradeAquan: quantities.A || 0,
      gradeBprice: unitPrices.B || 0,
      gradeBquan: quantities.B || 0,
      gradeCprice: unitPrices.C || 0,
      gradeCquan: quantities.C || 0,
      imageA: images.A || null, // Image for grade A
      imageB: images.B || null, // Image for grade B
      imageC: images.C || null, // Image for grade C
    };

    setCrops((prevCrops) => {
      console.log("Adding new crop:", newCrop);
      return [...prevCrops, newCrop];
    });
    resetCropEntry();

    // Toggle resetCameraImage to trigger the useEffect in CameraComponent
    setResetCameraImage((prev) => !prev);
    setCropCount((prevCount) => prevCount + 1);
  };

  const resetCropEntry = () => {
    setSelectedCrop(null);
    setSelectedVariety(null);
    setUnitPrices({ A: null, B: null, C: null });
    setImages({ A: null, B: null, C: null });
    setQuantities({ A: 0, B: 0, C: 0 });
    setShowCameraModels(false);
    setImage(null);
  };

  const handleImagePick = (
    base64Image: string | null,
    grade: "A" | "B" | "C"
  ) => {
    setImages((prevImages) => {
      return {
        ...prevImages,
        [grade]: base64Image,
      };
    });
    if (base64Image) {
      console.log(`${grade} image is set.`);
    } else {
      console.log(`${grade} image has been removed.`);
    }
  };

  const refreshCropForms = () => {
    setSelectedCrop(null);
    setSelectedVariety(null);
    setUnitPrices({ A: null, B: null, C: null });
    setQuantities({ A: 0, B: 0, C: 0 });
    setImages({ A: null, B: null, C: null });
    setResetImage(true);
    setTotal(0);
    setImage(null);
    setCrops([]);
    setdonebutton1visibale(true);
    setdonebutton2visibale(false);
    setdonebutton1disabale(true);
    setdonebutton2disabale(false);
    setaddbutton(true);
    setCropCount(1);
    setResetCameraImage((prev) => !prev);
  };

  const handleSubmit = async () => {
    try {
      if (crops.length === 0) {
        alert("Please add at least one crop to proceed.");
        return;
      }
      if (quantities.A > 0 && !images.A) {
        alert("Please upload an image for Grade A before submitting.");
        return; // Stop submission if the condition is met
      } else if (quantities.B > 0 && !images.B) {
        alert("Please upload an image for Grade B before submitting.");
        return; // Stop submission if the condition is met
      } else if (quantities.C > 0 && !images.C) {
        alert("Please upload an image for Grade C before submitting.");
        return; // Stop submission if the condition is met
      }

      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem("token");

      // Generate invoice number
      const invoiceNumber = await generateInvoiceNumber();
      if (!invoiceNumber) {
        alert("Failed to generate invoice number.");
        return;
      }

      let totalPrice = 0;

      crops.forEach((crop) => {
        // For each crop, calculate the total for each grade (A, B, C)
        totalPrice += crop.gradeAprice * crop.gradeAquan || 0;
        totalPrice += crop.gradeBprice * crop.gradeBquan || 0;
        totalPrice += crop.gradeCprice * crop.gradeCquan || 0;
      });

      console.log("Total Price:", totalPrice);
      setLoading(true);
      // Construct the payload including invoice number
      const payload = {
        farmerId: userId,
        invoiceNumber: invoiceNumber, // Include generated invoice number
        crops: crops.map((crop) => ({
          varietyId: crop.varietyId || "",
          gradeAprice: crop.gradeAprice || 0,
          gradeAquan: crop.gradeAquan || 0,
          gradeBprice: crop.gradeBprice || 0,
          gradeBquan: crop.gradeBquan || 0,
          gradeCprice: crop.gradeCprice || 0,
          gradeCquan: crop.gradeCquan || 0,
          // image: crop.image || null,
          imageA: crop.imageA || null, // Image for grade A
          imageB: crop.imageB || null, // Image for grade B
          imageC: crop.imageC || null,
        })),
      };

      console.log("Payload before sending:", payload);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Make the API call to submit crop data
      const response = await axios.post(
        `${environment.API_BASE_URL}api/unregisteredfarmercrop/add-crops`,
        payload,
        config
      );

      // Capture the registeredFarmerId from the response
      const { registeredFarmerId } = response.data;
      console.log("registeredFarmerId:", registeredFarmerId);

      Alert.alert(
        t("BankDetailsUpdate.Success"),
        t("Error.All crop details submitted successfully!")
      );

      await sendSMS(farmerLanguage, farmerPhone, totalPrice, invoiceNumber);

      refreshCropForms();
      setLoading(false);

      // Navigate to the ReportPage, passing registeredFarmerId and userId
      navigation.navigate("NewReport" as any, { userId, registeredFarmerId });
    } catch (error) {
      console.error("Error submitting crop data:", error);
      alert("Failed to submit crop details. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const sendSMS = async (
    language: string | null,
    farmerPhone: number,
    totalPrice: number,
    invoiceNumber: string
  ) => {
    // Clear the form after successful submission
    console.log("Sending SMS with details:", {
      language,
      farmerPhone,
      totalPrice,
      invoiceNumber,
    });
    const formattedPrice = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2, // Ensures at least two decimal places
      maximumFractionDigits: 2, // Limits to two decimal places
    }).format(totalPrice);

    // Log the formatted price for debugging
    console.log("Formatted Price:", formattedPrice);
    try {
      const apiUrl = "https://api.getshoutout.com/coreservice/messages";
      const headers = {
        Authorization: `Apikey ${environment.SHOUTOUT_API_KEY}`,
        "Content-Type": "application/json",
      };

      let Message = "";
      let companyName = "";
      if (language === "Sinhala") {
        companyName =
          (await AsyncStorage.getItem("companyNameSinhala")) || "AgroWorld";
        Message = `ඔබේ නිෂ්පාදන ${companyName} වෙත ලබා දීම ගැන ඔබට ස්තූතියි.
පැය 48ක් ඇතුළත රු. ${formattedPrice} ඔබේ බැංකු ගිණුමට බැර කෙරේ.
TID: ${invoiceNumber}`;
      } else if (language === "Tamil") {
        companyName =
          (await AsyncStorage.getItem("companyNameTamil")) || "AgroWorld";
        Message = `உங்கள் விளைபொருட்களை ${companyName} நிறுவனத்திற்கு வழங்கியதற்கு நன்றி.
ரூ. ${formattedPrice} 48 மணி நேரத்திற்குள் உங்கள் வங்கிக் கணக்கில் வரவு வைக்கப்படும்.
TID: ${invoiceNumber}
`;
      } else {
        companyName =
          (await AsyncStorage.getItem("companyNameEnglish")) || "AgroWorld";
        Message = `Thank you for providing your produce to ${companyName}.
Rs. ${formattedPrice} will be credited to your bank account within 48 hours.
TID: ${invoiceNumber}
`;
      }

      const formattedPhone = farmerPhone;

      const body = {
        source: "AgroWorld",
        destinations: [formattedPhone],
        content: {
          sms: Message,
        },
        transports: ["sms"],
      };

      const response = await axios.post(apiUrl, body, { headers });

      if (response.data.referenceId) {
        Alert.alert("Success", "SMS notification sent successfully!");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      //   Alert.alert(
      //     "Error",
      //     "Failed to send notification. Please try again."
      //   );
    }
  };
  const isGradeACameraEnabled = quantities.A == 0;
  const isGradeBCameraEnabled = quantities.B == 0;
  const isGradeCCameraEnabled = quantities.C == 0;
  console.log("isGradeACameraEnabled:", isGradeACameraEnabled);
  // Add this to your component's state declarations

  const deleteVariety = (index: number) => {
    const newCrops = [...crops];
    newCrops.splice(index, 1); // Remove the crop at the given index
    setCrops(newCrops);

    // Adjust crop count and button visibility
    if (newCrops.length === 0) {
      setdonebutton1visibale(true);
      setdonebutton2visibale(false);
      setaddbutton(true);
    } else {
    }

    setCropCount((prevCount) => prevCount - 1);
  };

  const deleteGrade = (cropIndex: number, grade: "A" | "B" | "C") => {
    const newCrops = [...crops];

    // Reset the grade details to delete the grade
    newCrops[cropIndex][`grade${grade}quan`] = 0;
    newCrops[cropIndex][`grade${grade}price`] = 0;
    newCrops[cropIndex][`image${grade}`] = null; // Remove the associated image

    // Check if all grades for this crop are deleted
    const allGradesDeleted = ["A", "B", "C"].every(
      (grade) => newCrops[cropIndex][`grade${grade}quan`] === 0
    );
    console.log("safsffsdf  fsfs", allGradesDeleted);

    // If all grades are deleted for this crop, remove the entire crop
    if (allGradesDeleted) {
      newCrops.splice(cropIndex, 1);
      setCrops(newCrops);
      setCropCount((prevCount) => prevCount - 1);
    } else {
      // If there are still grades left, update the crop
      setCrops(newCrops);
    }

    // Update crop count and handle button visibility if crops are deleted
    if (newCrops.length === 0) {
      setdonebutton1visibale(true);
      setdonebutton2visibale(false);
      setaddbutton(true);
    }

    // Update the crop count in the state
  };

  // Then in your JSX:
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-gray-50 px-6 py-4 mb-8"
        style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="">
            <AntDesign name="left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-xl font-bold text-black">
            {t("UnregisteredCropDetails.FillDetails")}
          </Text>
        </View>
        <View className="-mb-4">

        <View className="justify-center items-center">
          {/* Conditionally render the left arrow only if there are more than one item */}
          {crops.length > 1 && (
            <TouchableOpacity
              onPress={scrollToPrevious}
              style={{
                position: "absolute",
                left: 1,
                zIndex: 10,
                 opacity: isAtStart ? 0.3 : 1,
              }}
              disabled = {isAtStart}
            >
              <Entypo name="chevron-left"  size={34} color="#374151" />
            </TouchableOpacity>
          )}

          {crops.length > 0 && (
         <ScrollView
  ref={scrollViewRef}
  horizontal
  showsHorizontalScrollIndicator={false}
  style={{ marginBottom: 20 }}
  contentContainerStyle={{ 
    paddingHorizontal: wp(6), // Add padding to ensure items can be centered
    alignItems: 'center' // Center items vertically
  }}
  className="flex-row"
  onScroll={onScroll}
  snapToInterval={wp(70) + 10} // Snap to each item's width + margin
  decelerationRate="fast" // Makes scrolling feel more precise
  snapToAlignment="center" // Always snap to center
>
              {crops.map((crop, index) => {
                const availableGrades = ["A", "B", "C"].filter(
                  (grade) => crop[`grade${grade}quan`] > 0
                );

                return (
               <View
  key={index}
  style={{
    width: wp(70),
    marginHorizontal: 10, // Consistent horizontal margin
    padding: 12,
  }}
>
                    <View className="flex-row items-center mb-2">
                      <Text className="font-bold text-base mr-2">
  ({index + 1}) {crop.varietyName.length > 20 ? `${crop.varietyName.slice(0, 20)}...` : crop.varietyName}
</Text>

                      <TouchableOpacity onPress={() => deleteVariety(index)}>
                        <MdIcons
                          name="delete"
                          size={22}
                          style={{ color: "red" }}
                        />
                      </TouchableOpacity>
                    </View>

                    <View className="border border-[#d4d4d4] rounded-lg ">
                      {availableGrades.map((grade, gIndex) => (
                        <View
                          key={grade}
                          style={{
                            marginTop: 6,
                            borderBottomWidth:
                              gIndex !== availableGrades.length - 1 ? 1 : 0,
                            borderBottomColor: "#d4d4d4",
                            paddingBottom:
                              gIndex !== availableGrades.length - 1 ? 6 : 0,
                          }}
                          className="flex-row items-center justify-between p-1 mb-1 "
                        >
                          <Text className="font-bold ml-2 ">{grade}</Text>
                          <Text className="font-bold">
                            {crop[`grade${grade}quan`]}kg
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              deleteGrade(index, grade as "A" | "B" | "C")
                            }
                            className="mr-2"
                          >
                            <MdIcons
                              name="delete"
                              size={22}
                              style={{ color: "red" }}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                );
                                      

              })}

            </ScrollView>
          )}

          {/* Conditionally render the right arrow only if there are more than one item */}
          {crops.length > 1 && (
            <TouchableOpacity
              onPress={scrollToNext}
              style={{
                position: "absolute",
                right: 1,
                zIndex: 10,
                opacity: isAtEnd ? 0.3 : 1
              }}
               disabled = {isAtEnd}
            >
              <Entypo name="chevron-right"  size={34}   color="#000000"  />
            </TouchableOpacity>
          )}
        </View>
</View>
 {crops.length > 0 && (
  <View className="mt-2 mb-2">
  <DashedLine
    dashLength={5}
    dashGap={4}
    dashColor="#980775"
  />
</View>

 )}
        <Text className="text-center text-md font-medium mt-2">
          {t("UnregisteredCropDetails.Crop")} {cropCount}
        </Text>
        <View className="mb-6 border-b p-2 border-gray-200 pb-6">
          <Text className="text-gray-600 mt-4">
            {t("UnregisteredCropDetails.CropName")}
          </Text>
          <View className="mt-2">
            <SelectList
              key={selectedCrop ? selectedCrop.id : Math.random()}
              defaultOption={
                selectedCrop
                  ? { key: selectedCrop.id, value: selectedCrop.name }
                  : undefined
              }
              setSelected={(val: string) => {
                const selectedCropObj = cropNames.find((crop) =>
                  selectedLanguage === "en"
                    ? crop.cropNameEnglish === val
                    : selectedLanguage === "si"
                    ? crop.cropNameSinhala === val
                    : crop.cropNameTamil === val
                );
                if (selectedCropObj) {
                  handleCropChange(selectedCropObj);
                }
              }}
              boxStyles={{
                height: 50,
                width: "100%",
                borderColor: "#FFFFFF",
                paddingLeft: 14,
                paddingRight: 8,
                backgroundColor: "#F4F4F4", // ✳️ Light gray background
                borderRadius: 50, // ✳️ Rounded corners
              }}
              data={cropNames.map((crop) => ({
                key: crop.id,
                value:
                  selectedLanguage === "en"
                    ? crop.cropNameEnglish
                    : selectedLanguage === "si"
                    ? crop.cropNameSinhala
                    : crop.cropNameTamil,
              }))}
              save="value"
              placeholder={t("UnregisteredCropDetails.Select Crop")}
              searchPlaceholder={t("search")}
            />
          </View>

          <Text className="text-gray-600 mt-4">
            {t("UnregisteredCropDetails.Variety")}
          </Text>
          <View className="mt-2">
            <SelectList
              key={selectedVariety ? selectedVariety : Math.random()}
              setSelected={(itemValue: string) =>
                selectedCrop ? handleVarietyChange(itemValue) : null
              }
              // data={[
              //   ...varieties.map((variety) => ({
              //     key: variety.id,
              //     value: variety.variety,
              //   })),
              // ]}
                  data={[
        ...varieties
            .filter(variety => !usedVarietyIds.includes(variety.id)) // Filter out used varieties
            .map(variety => ({
                key: variety.id,
                value: variety.variety,
            }))
    ]}
              save="key"
              defaultOption={
                selectedVariety
                  ? {
                      key: selectedVariety,
                      value:
                        varieties.find((v) => v.id === selectedVariety)
                          ?.variety || "Select Variety",
                    }
                  : undefined
              }
              placeholder={t("UnregisteredCropDetails.Select Variety")}
              boxStyles={{
                height: 50,
                width: "100%",
                borderColor: "#FFFFFF",
                paddingLeft: 14,
                paddingRight: 8,
                backgroundColor: "#F4F4F4", // ✳️ Light gray background
                borderRadius: 50, // ✳️ Rounded corners
              }}
            />
          </View>

          <Text className="text-gray-600 mt-4">
            {t("UnregisteredCropDetails.UnitGrades")}
          </Text>
          <View className="border border-gray-300 rounded-lg mt-2 p-4">
            {["A", "B", "C"].map((grade) => (
              <View key={grade} className="flex-row items-center mb-3">
                <Text className="w-8 text-gray-600">{grade}</Text>
                <TextInput
                  placeholder="Rs."
                  keyboardType="numeric"
                  className="flex-1  rounded-full p-2 mx-2 text-gray-600 bg-[#F4F4F4] text-center"
                  value={unitPrices[grade]?.toString() || ""}
                  editable={false}
                />
                <TextInput
                  placeholder="kg"
                  keyboardType="numeric"
                  className="flex-1 rounded-full p-2 mx-2 text-gray-600 bg-[#F4F4F4] text-center"
                  value={quantities[grade].toString()}
                  onChangeText={(value) => {
                    const numericValue = value.replace(/[^0-9]/g, "");
                    handleQuantityChange(grade, numericValue);
                  }}
                />
              </View>
            ))}
          </View>

          {showCameraModels && (
            <View className="flex-row items-center justify-between">
              <CameraComponent
                onImagePicked={(image) => handleImagePick(image, "A")}
                grade={"A"}
                resetImage={resetImage}
                disabled={isGradeACameraEnabled}
              />
              <CameraComponent
                onImagePicked={(image) => handleImagePick(image, "B")}
                grade={"B"}
                resetImage={resetImage}
                disabled={isGradeBCameraEnabled}
              />
              <CameraComponent
                onImagePicked={(image) => handleImagePick(image, "C")}
                grade={"C"}
                resetImage={resetImage}
                disabled={isGradeCCameraEnabled}
              />
            </View>
          )}

          <Text className="text-gray-600 mt-4">
            {t("UnregisteredCropDetails.Total")}
          </Text>
          <View className="bg-[#F4F4F4] rounded-full mt-2 p-2">
            <TextInput
              placeholder="--Auto Fill--"
              editable={false}
              value={` ${total.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              className="text-gray-600 text-center"
            />
          </View>

          <TouchableOpacity
            onPress={incrementCropCount}
            disabled={addbutton || loading}
            className={`bg-[#000000] rounded-full p-4 mt-2 ${
              addbutton || loading ? "opacity-25" : ""
            }`}
          >
            <Text className="text-center text-white font-semibold text-base">
              {t("UnregisteredCropDetails.Add")}
            </Text>
          </TouchableOpacity>

          {/* {donebutton1visibale && 
          <TouchableOpacity 
            onPress={handelsubmit2} 
            disabled={donebutton1disabale || loading} 
            className={`bg-black rounded-full p-4 mt-4 ${(donebutton1disabale || loading) ? 'opacity-50' : ''}`}
          >
            {loading ? (
              <View className="flex-row justify-center items-center">
                <LottieView
                  source={require('../assets/lottie/collector.json')}
                  autoPlay
                  loop
                  style={{ width: 30, height: 30 }}
                />
                <Text className="text-center text-white font-semibold ml-2">{t("UnregisteredCropDetails.Processing...")}</Text>
              </View>
            ) : (
              <Text className="text-center text-white font-semibold">{t("UnregisteredCropDetails.Done")}</Text>
            )}
          </TouchableOpacity>
        } */}

          {donebutton2visibale && (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={donebutton2disabale || loading}
              className={`bg-[#980775] rounded-full p-4 mt-4 mb-10 ${
                donebutton2disabale || loading ? "opacity-50" : ""
              }`}
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <LottieView
                    source={require("../assets/lottie/newLottie.json")}
                    autoPlay
                    loop
                    style={{ width: 30, height: 30 }}
                  />
                  <Text className="text-center text-white font-semibold ml-2 text-base">
                    {t("UnregisteredCropDetails.Processing...")}
                  </Text>
                </View>
              ) : (
                <Text className="text-center text-white font-semibold text-base">
                  {t("UnregisteredCropDetails.Done")}{" "}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UnregisteredCropDetails;
