import React, { useEffect, useRef, useState } from 'react';
import AuthGuardCaller from '@/features/auth/guards/AuthGuard';
import { Animated, Image, ImageBackground, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { BaseCard } from '@/components/cards';
import styles from '../styles/splash.styles';

export default function SplashScreen() {
  const dot1Ref = useRef(new Animated.Value(0));
  const dot2Ref = useRef(new Animated.Value(0));
  const dot3Ref = useRef(new Animated.Value(0));
  const [mountedDots, setMountedDots] = useState<{ d1?: Animated.Value; d2?: Animated.Value; d3?: Animated.Value }>({});

  useEffect(() => {
    const dot1 = dot1Ref.current;
    const dot2 = dot2Ref.current;
    const dot3 = dot3Ref.current;
    const animateDot = (value: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 180);
    animateDot(dot3, 360);
    setMountedDots({ d1: dot1, d2: dot2, d3: dot3 });
  }, []);

  const renderDot = (animation: Animated.Value) => (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity: animation.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
          transform: [{ scale: animation.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.35] }) }],
        },
      ]}
    />
  );

  return (
    <ImageBackground source={require('@/assets/images/splash.png')} resizeMode="cover" style={styles.background}>
      <View style={styles.overlay} />

      <BaseCard elevation="xl" style={styles.card}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        <AppText variant="h2" style={styles.title}>TutorKonnect</AppText>
        <AppText variant="body" style={styles.subtitle}>Preparing your learning journey...</AppText>

        <View style={styles.loaderContainer}>
          {mountedDots.d1 ? renderDot(mountedDots.d1) : null}
          {mountedDots.d2 ? renderDot(mountedDots.d2) : null}
          {mountedDots.d3 ? renderDot(mountedDots.d3) : null}
        </View>
      </BaseCard>

      <AuthGuardCaller />
    </ImageBackground>
  );
}