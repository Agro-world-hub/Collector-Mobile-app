// // CameraComponent.tsx
// import React, { useState } from 'react';
// import { View, Button, Image, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';

// interface CameraComponentProps {
//   onImagePicked: (base64Image: string | null) => void; // Pass base64 image string to parent
// }

// const CameraComponent: React.FC<CameraComponentProps> = ({ onImagePicked }) => {
//   const [image, setImage] = useState<any>(null);

//   // Handle picking image from gallery
//   const handlePickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//       base64: true, // Ensure the result includes base64 data
//     });

//     if (!result.canceled && result.assets[0]?.base64) {
//       setImage(result);
//       onImagePicked(result.assets[0].base64);  // Send base64 image to parent component
//     } else {
//       Alert.alert("No image selected", "Please select an image.");
//     }
//   };

//   // Handle capturing image from camera
//   const handleCaptureImage = async () => {
//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//       base64: true, // Ensure the result includes base64 data
//     });

//     if (!result.canceled && result.assets[0]?.base64) {
//       setImage(result);
//       onImagePicked(result.assets[0].base64);  // Send base64 image to parent component
//     } else {
//       Alert.alert("No image captured", "Please capture an image.");
//     }
//   };

//   return (
//     <View>
      
//       <Button title="Take a Photo" onPress={handleCaptureImage} color="black"/>
      
//       {/* Display selected image if available */}
//       {image && (
//         <Image
//           source={{ uri: `data:image/jpeg;base64,${image.assets[0].base64}` }}
//           style={{ width: 200, height: 200, marginTop: 10, marginLeft: 70 }}
//         />
//       )}
//     </View>
//   );
// };

// export default CameraComponent;

import React, { useState, useEffect } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

interface CameraComponentProps {
  onImagePicked: (base64Image: string | null) => void; // Pass base64 image string to parent
  resetImage?: boolean; // New prop to trigger image reset
}

const CameraComponent: React.FC<CameraComponentProps> = ({ 
  onImagePicked, 
  resetImage = false 
}) => {
  const [image, setImage] = useState<any>(null);

  // Watch for resetImage prop changes to clear the image
  useEffect(() => {
    if (resetImage) {
      setImage(null);
    }
  }, [resetImage]);

  // Compress and resize image to reduce payload size
  const processImage = async (uri: string): Promise<string | null> => {
    try {
      // Use ImageManipulator to resize and compress the image
      const processedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Resize to max width of 800px
        { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      
      return processedImage.base64 || null;
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image');
      return null;
    }
  };

  // Handle picking image from gallery
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Reduce initial quality to 50%
      base64: false, // Don't request base64 here
    });

    if (!result.canceled && result.assets[0]?.uri) {
      // Process the image to reduce size
      const base64Image = await processImage(result.assets[0].uri);
      
      if (base64Image) {
        setImage({ ...result, assets: [{ ...result.assets[0], base64: base64Image }] });
        onImagePicked(base64Image);
      }
    } else {
      Alert.alert("No image selected", "Please select an image.");
    }
  };

  // Handle capturing image from camera
  const handleCaptureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Reduce initial quality to 50%
      base64: false, // Don't request base64 here
    });

    if (!result.canceled && result.assets[0]?.uri) {
      // Process the image to reduce size
      const base64Image = await processImage(result.assets[0].uri);
      
      if (base64Image) {
        setImage({ ...result, assets: [{ ...result.assets[0], base64: base64Image }] });
        onImagePicked(base64Image);
      }
    } else {
      Alert.alert("No image captured", "Please capture an image.");
    }
  };

  return (
    <View>
      <Button title="Take a Photo" onPress={handleCaptureImage} color="black"/>
     
      {/* Display selected image if available */}
      {image && image.assets[0]?.base64 && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${image.assets[0].base64}` }}
          style={{ width: 200, height: 200, marginTop: 10, marginLeft: 70 }}
        />
      )}
    </View>
  );
};

export default CameraComponent;