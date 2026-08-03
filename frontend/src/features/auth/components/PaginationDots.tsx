import { View } from 'react-native';

interface PaginationDotsProps {
  length: number;
  currentIndex: number;
}

export function PaginationDots({ length, currentIndex }: PaginationDotsProps) {
  return (
    <View className="flex-row justify-center gap-2">
      {Array(length)
        .fill(null)
        .map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${
              index === currentIndex
                ? 'bg-[#13275F] w-8'
                : 'bg-slate-300 w-2'
            }`}
          />
        ))}
    </View>
  );
}