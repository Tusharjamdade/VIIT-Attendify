import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CardProps {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({ title, icon, color, onPress }) => {
  const { width } = Dimensions.get('window');
  const cardSize = width / 2.4;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${color} rounded-2xl shadow-md`}
      style={{
        width: cardSize,
        height: cardSize,
        marginBottom: cardSize * 0.15,
      }}
    >
      <View className="flex-1 justify-center items-center p-4">
        <View className="rounded-full bg-white/10 p-4 mb-2">
          <Feather name={icon} size={cardSize * 0.3} color="white" />
        </View>
        <Text className="text-white text-center font-semibold"
          style={{ fontSize: cardSize * 0.1 }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Card;
