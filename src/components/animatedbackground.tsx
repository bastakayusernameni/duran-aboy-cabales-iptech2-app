import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function AnimatedBackground() {
  const blob1 = useRef(new Animated.Value(0)).current;
  const blob2 = useRef(new Animated.Value(0)).current;
  const blob3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 6000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 6000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    loop(blob1, 0);
    loop(blob2, 1000);
    loop(blob3, 2000);
  }, []);

  const move = (anim: Animated.Value, x: number, y: number) => ({
    transform: [
      {
        translateX: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [x, x + 40],
        }),
      },
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [y, y - 50],
        }),
      },
    ],
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.base} />

      <Animated.View style={[styles.blob1, move(blob1, 40, 120)]} />
      <Animated.View style={[styles.blob2, move(blob2, 200, 300)]} />
      <Animated.View style={[styles.blob3, move(blob3, -30, 500)]} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF8F5',
  },

  blob1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#F8D7DA',
    opacity: 0.35,
  },

  blob2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#E6C7FF',
    opacity: 0.25,
  },

  blob3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FCEEF5',
    opacity: 0.4,
  },
});