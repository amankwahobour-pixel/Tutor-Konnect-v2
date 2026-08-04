import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, useWindowDimensions, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '@/components';
import { AppText } from '@/components/ui/AppText';
import { styles as createStyles } from '../styles/welcome.styles';
import { useThemedStyles } from '@/theme';

const onboardingData = [
  {
    id: '1',
    image: require('@/assets/images/onboarding-1.png'),
    title: 'Find expert tutors',
    description: 'Connect with qualified tutors who match your learning goals and schedule.',
  },
  {
    id: '2',
    image: require('@/assets/images/onboarding-2.png'),
    title: 'Learn anywhere',
    description: 'Access lessons and educational resources from anywhere, at your pace.',
  },
  {
    id: '3',
    image: require('@/assets/images/onboarding-3.png'),
    title: 'Track every step',
    description: 'Monitor your progress and stay motivated throughout your journey.',
  },
  {
    id: '4',
    image: require('@/assets/images/onboarding-4.png'),
    title: 'Achieve more',
    description: 'Reach your goals with personalized support and a clear path forward.',
  },
];

export default function WelcomeScreen() {
  const styles = useThemedStyles(createStyles);
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [currentIndex, fadeAnim]);

  const handleNext = async () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < onboardingData.length) {
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      try {
        const { saveOnboardingComplete } = await import('@/features/auth/services/auth-storage');
        await saveOnboardingComplete();
      } catch (e) {
        console.error('Unable to persist onboarding flag', e);
      }
      router.replace('/(auth)/sign-in');
    }
  };

  const handleSkip = async () => {
    try {
      const { saveOnboardingComplete } = await import('@/features/auth/services/auth-storage');
      await saveOnboardingComplete();
    } catch (e) {
      console.error('Unable to persist onboarding flag', e);
    }
    router.replace('/(auth)/sign-in');
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);

    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={styles.wavesContainer}>
        <Image source={require('@/assets/images/waves.png')} style={styles.waves} resizeMode="cover" />
      </View>

      <View style={styles.headerRow}>
        <AppText variant="caption" style={styles.eyebrow}>Onboarding</AppText>
        <SecondaryButton title="Skip" onPress={handleSkip} containerStyle={styles.skipButton} />
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={{ width: width * onboardingData.length }}
      >
        {onboardingData.map((item) => (
          <Animated.View key={item.id} style={[styles.slide, { width }, { opacity: fadeAnim }]}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <AppText variant="h2" style={styles.title}>{item.title}</AppText>
            <AppText variant="body" style={styles.description}>{item.description}</AppText>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
        ))}
      </View>

      <View style={styles.actionsRow}>
        <PrimaryButton title={currentIndex === onboardingData.length - 1 ? 'Get started' : 'Continue'} onPress={handleNext} containerStyle={styles.button} />
      </View>
    </View>
  );
}
