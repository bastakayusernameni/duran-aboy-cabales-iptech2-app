import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { supabase } from './supabase';

type LogoutProps = {
  onLogoutSuccess: () => void;
};

export default function Logout({ onLogoutSuccess }: LogoutProps) {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        Alert.alert('Logout Failed', error.message);
        return;
      }

      onLogoutSuccess();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Something went wrong while signing out.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={handleLogout}
      activeOpacity={0.85}
    >
      <Text style={styles.logoutButtonText}>Sign Out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: '#14213D',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#223657',
  },
  logoutButtonText: {
    color: '#A0B9DC',
    fontSize: 13,
    fontWeight: '700',
  },
});