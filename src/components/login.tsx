import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { supabase } from '../components/supabase';

type LoginProps = {
  onLoginSuccess: (username: string) => void;
};

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRegister, setIsRegister] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      setError('Incorrect username or password');
      return;
    }

    setError('');
    Alert.alert('Success', 'Successfully Logged In!');

    setTimeout(() => {
      onLoginSuccess(username);
    }, 800);
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      setError('Username already exists');
      return;
    }

    const { error } = await supabase.from('users').insert([
      { username, password },
    ]);

    if (error) {
      setError('Registration failed');
      return;
    }

    Alert.alert('Success', 'Account created!');
    setIsRegister(false);
    setUsername('');
    setPassword('');
  };

  const handleSubmit = () => {
    isRegister ? handleRegister() : handleLogin();
  };

  return (
    <View style={styles.wrapper}>

      {/* CONTENT */}
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Expense Tracker</Text>

          <Text style={styles.subtitle}>
            {isRegister ? 'Create an account' : 'Login to continue'}
          </Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor="#9B8CA1"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setError('');
            }}
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#9B8CA1"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {isRegister ? 'Register' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            <Text style={styles.toggle}>
              {isRegister
                ? 'Already have an account? Login'
                : 'No account? Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    color: '#5C5470',
  },

  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#8E7C93',
    marginBottom: 20,
    marginTop: 6,
  },

  input: {
    backgroundColor: '#FCEEF5',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    color: '#5C5470',
  },

  error: {
    color: '#D9534F',
    fontSize: 13,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#F8D7DA',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
    fontWeight: '700',
    color: '#5C5470',
    fontSize: 16,
  },

  toggle: {
    textAlign: 'center',
    marginTop: 14,
    fontSize: 13,
    color: '#7B6F82',
    fontWeight: '600',
  },
});