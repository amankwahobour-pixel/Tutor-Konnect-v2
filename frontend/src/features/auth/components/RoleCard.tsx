import { Pressable, Text, View } from 'react-native';

interface RoleCardProps {
  title: string;
  description: string;
  icon: string;
  selected?: boolean;
  onPress: () => void;
}

export function RoleCard({ title, description, icon, selected = false, onPress }: RoleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`p-6 rounded-xl border-2 mb-4 ${
        selected
          ? 'bg-blue-50 border-[#13275F]'
          : 'bg-white border-slate-200'
      }`}
    >
      <View className="flex-row items-center mb-2">
        <Text className="text-3xl mr-3">{icon}</Text>
        <Text className={`text-lg font-bold ${
          selected ? 'text-[#13275F]' : 'text-slate-950'
        }`}>
          {title}
        </Text>
      </View>
      <Text className={`text-sm ${
        selected ? 'text-blue-700' : 'text-slate-600'
      }`}>
        {description}
      </Text>
    </Pressable>
  );
}