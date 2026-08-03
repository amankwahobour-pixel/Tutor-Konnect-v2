import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
}

export function OTPInput({ length = 6, onComplete }: OTPInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    
    if (text.length > 1) {
      // Handle paste
      const pastedCode = text.replace(/\D/g, '').split('');
      for (let i = 0; i < Math.min(pastedCode.length, length - index); i++) {
        newCode[index + i] = pastedCode[i];
      }
      setCode(newCode);
      
      // Focus last filled input or last input
      const lastFilledIndex = Math.min(index + pastedCode.length - 1, length - 1);
      if (lastFilledIndex < length - 1) {
        inputRefs.current[lastFilledIndex + 1]?.focus();
      }
      
      // Call onComplete if all filled
      if (newCode.every(c => c !== '')) {
        onComplete(newCode.join(''));
      }
    } else {
      newCode[index] = text;
      setCode(newCode);
      
      if (text && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      
      if (newCode.every(c => c !== '')) {
        onComplete(newCode.join(''));
      }
    }
  };

  const handleBackspace = (index: number) => {
    const newCode = [...code];
    newCode[index] = '';
    setCode(newCode);
    
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-center gap-3">
      {Array(length)
        .fill(null)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            maxLength={1}
            keyboardType="number-pad"
            value={code[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') {
                handleBackspace(index);
              }
            }}
            className="w-12 h-14 border-2 border-slate-300 rounded-lg text-center text-xl font-bold text-slate-950"
          />
        ))}
    </View>
  );
}