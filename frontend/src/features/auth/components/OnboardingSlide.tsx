import { Text, View } from 'react-native';

interface OnboardingSlidesProps {
  title: string;
  description: string;
  icon: string;
}

export function OnboardingSlide({ title, description, icon }: OnboardingSlidesProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-5xl mb-6">{icon}</Text>
      <Text className="text-2xl font-bold text-slate-950 text-center mb-3">
        {title}
      </Text>
      <Text className="text-slate-600 text-center text-lg">
        {description}
      </Text>
    </View>
  );
}