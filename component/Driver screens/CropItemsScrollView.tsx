import React, { useState, useRef } from 'react';
import { View, Text, TextInput, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

interface CropItem {
  itemId: number;
  cropId: number;
  varietyId: number;
  loadWeight: number;
  cropName?: string;
  varietyName?: string;
  crop?: string;
  variety?: string;
}

interface CropItemsScrollViewProps {
  items: CropItem[];
  crops: Record<number, string>;
  varieties: Record<number, string>;
  onItemUpdate: (updatedItem: CropItem) => void;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 40; // 20px padding on each side

const CropItemsScrollView: React.FC<CropItemsScrollViewProps> = ({
  items,
  crops,
  varieties,
  onItemUpdate
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / ITEM_WIDTH);
    setActiveIndex(newIndex);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * ITEM_WIDTH, animated: true });
    setActiveIndex(index);
  };

  const updateItemField = (index: number, field: keyof CropItem, value: any) => {
    const updatedItem = { ...items[index], [field]: value };
    onItemUpdate(updatedItem);
  };

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {items.map((item, index) => (
          <View key={item.itemId || index} style={{ width: ITEM_WIDTH }}>
            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-1">Crop</Text>
              <TextInput
                className="border border-gray-300 rounded px-3 py-2 text-base"
                value={item.cropName || ''}
                editable={false}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-1">Variety</Text>
              <TextInput
                className="border border-gray-300 rounded px-3 py-2 text-base"
                value={item.varietyName || ''}
                editable={false}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-1">Load in kg (Approx)</Text>
              <TextInput
                className="border border-gray-300 rounded px-3 py-2 text-base"
                value={item.loadWeight.toString()}
                onChangeText={(text) => updateItemField(index, 'loadWeight', parseFloat(text) || 0)}
                keyboardType="numeric"
              />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Indicator */}
      <View className="flex-row justify-center my-4">
        {items.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
          >
            <View
              className={`h-2 w-2 rounded-full mx-1 ${activeIndex === index ? 'bg-black' : 'bg-gray-300'}`}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CropItemsScrollView;