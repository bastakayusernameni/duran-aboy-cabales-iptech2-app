import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { supabase } from '../components/supabase';

type LoginProps = {
  onLoginSuccess: (username: string) => void;
};

export default function Login({
  onLoginSuccess,
}: LoginProps) {
  const [username, setUsername] =
    useState<string>('');

  const [password, setPassword] =
    useState<string>('');

  const [error, setError] =
    useState<string>('');

  const [isRegister, setIsRegister] =
    useState<boolean>(false);

  const [loading, setLoading] =
    useState<boolean>(false);

  const shakeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const fadeAnim = useRef(
    new Animated.Value(1)
  ).current;

  // =========================
  // SHAKE ANIMATION
  // =========================

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),

      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 60,
        useNativeDriver: true,
      }),

      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),

      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),

      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async () => {
    if (loading) return;

    setError('');

    if (!username.trim()) {
      setError('Please enter your email.');
      triggerShake();
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      // SUPABASE AUTH LOGIN
      const { data, error } =
        await supabase.auth.signInWithPassword(
          {
            email: username.trim(),
            password,
          }
        );

      if (error) {
        console.log(error);

        setError(error.message);

        triggerShake();

        setLoading(false);

        return;
      }

      if (data.user) {
        setError('');

        Alert.alert(
          'Welcome Back',
          `Logged in as ${data.user.email}`
        );

        onLoginSuccess(
          data.user.email || 'User'
        );
      }
    } catch (err) {
      console.log(err);

      setError(
        'Something went wrong.'
      );

      triggerShake();
    }

    setLoading(false);
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = async () => {
    if (loading) return;

    setError('');

    if (!username.trim()) {
      setError('Please enter your email.');
      triggerShake();
      return;
    }

    if (!password.trim()) {
      setError(
        'Please enter your password.'
      );

      triggerShake();

      return;
    }

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      );

      triggerShake();

      return;
    }

    setLoading(true);

    try {
      // SUPABASE AUTH REGISTER
      const { data, error } =
        await supabase.auth.signUp({
          email: username.trim(),
          password,
        });

      if (error) {
        console.log(error);

        setError(error.message);

        triggerShake();

        setLoading(false);

        return;
      }

      Alert.alert(
        'Success',
        'Account created successfully.'
      );

      // AUTO LOGIN AFTER REGISTER
      if (data.user) {
        onLoginSuccess(
          data.user.email || 'User'
        );
      }

      setUsername('');
      setPassword('');
      setError('');
    } catch (err) {
      console.log(err);

      setError(
        'Registration failed.'
      );

      triggerShake();
    }

    setLoading(false);
  };

  // =========================
  // SWITCH MODE
  // =========================

  const switchMode = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();

    setIsRegister((prev) => !prev);

    setError('');
  };

  // =========================
  // UI
  // =========================

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
    >
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <View style={styles.container}>
        {/* BRAND */}
        <View style={styles.brandBlock}>
          <Text style={styles.brandName}>
            VAULT
          </Text>

          <Text
            style={styles.brandTagline}
          >
            Your personal finance
            tracker
          </Text>
        </View>

        {/* CARD */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                {
                  translateX:
                    shakeAnim,
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
            }}
          >
            <Text
              style={styles.cardTitle}
            >
              {isRegister
                ? 'Create Account'
                : 'Welcome Back'}
            </Text>

            <Text
              style={
                styles.cardSubtitle
              }
            >
              {isRegister
                ? 'Sign up to start tracking'
                : 'Log in to your account'}
            </Text>
          </Animated.View>

          {/* EMAIL */}
          <View
            style={styles.inputWrapper}
          >
            <Text
              style={styles.inputLabel}
            >
              Email
            </Text>

            <TextInput
              placeholder="example@email.com"
              placeholderTextColor="#3A4D6B"
              value={username}
              onChangeText={(t) => {
                setUsername(t);
                setError('');
              }}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          {/* PASSWORD */}
          <View
            style={styles.inputWrapper}
          >
            <Text
              style={styles.inputLabel}
            >
              Password
            </Text>

            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#3A4D6B"
              secureTextEntry
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setError('');
              }}
              style={styles.input}
            />
          </View>

          {/* ERROR */}
          {error ? (
            <View
              style={styles.errorBox}
            >
              <Text
                style={
                  styles.errorText
                }
              >
                ⚠ {error}
              </Text>
            </View>
          ) : null}

          {/* BUTTON */}
          <TouchableOpacity
            style={[
              styles.button,
              loading &&
                styles.buttonDisabled,
            ]}
            onPress={
              isRegister
                ? handleRegister
                : handleLogin
            }
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#070E1C" />
            ) : (
              <Text
                style={
                  styles.buttonText
                }
              >
                {isRegister
                  ? 'Create Account'
                  : 'Log In'}
              </Text>
            )}
          </TouchableOpacity>

          {/* DIVIDER */}
          <View style={styles.divider}>
            <View
              style={
                styles.dividerLine
              }
            />

            <Text
              style={
                styles.dividerText
              }
            >
              or
            </Text>

            <View
              style={
                styles.dividerLine
              }
            />
          </View>

          {/* TOGGLE */}
          <TouchableOpacity
            onPress={switchMode}
            style={styles.toggleBtn}
          >
            <Text
              style={styles.toggleText}
            >
              {isRegister
                ? 'Already have an account? '
                : 'New here? '}

              <Text
                style={
                  styles.toggleHighlight
                }
              >
                {isRegister
                  ? 'Log In'
                  : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* FOOTER */}
        <Text style={styles.footerText}>
          Vault · All Rights Reserved
          2026
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#070E1C',
  },

  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#0F1A2E',
    top: -80,
    right: -80,
    opacity: 0.9,
  },

  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#0F1A2E',
    bottom: 60,
    left: -60,
    opacity: 0.7,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  brandBlock: {
    alignItems: 'center',
    marginBottom: 36,
  },

  brandName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#C8A55A',
    letterSpacing: 8,
  },

  brandTagline: {
    fontSize: 13,
    color: '#6B7FA3',
    marginTop: 6,
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: '#0F1A2E',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: '#1A2A45',
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#EAF0FB',
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 13,
    color: '#6B7FA3',
    marginBottom: 24,
  },

  inputWrapper: {
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 11,
    color: '#A0B9DC',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 7,
  },

  input: {
    backgroundColor: '#070E1C',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1A2A45',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#EAF0FB',
  },

  errorBox: {
    backgroundColor: '#1A0E0E',
    borderWidth: 1,
    borderColor: '#E05A5A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  errorText: {
    color: '#E05A5A',
    fontSize: 13,
    fontWeight: '600',
  },

  button: {
    backgroundColor: '#C8A55A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#070E1C',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1A2A45',
  },

  dividerText: {
    fontSize: 12,
    color: '#3A4D6B',
    fontWeight: '600',
  },

  toggleBtn: {
    alignItems: 'center',
  },

  toggleText: {
    fontSize: 13,
    color: '#6B7FA3',
  },

  toggleHighlight: {
    color: '#C8A55A',
    fontWeight: '700',
  },

  footerText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 10,
    color: '#1A2A45',
    letterSpacing: 1,
  },
});