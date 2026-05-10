import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';

import Login from './src/components/login';
import AnimatedBackground from './src/components/animatedbackground';
import { supabase } from './src/components/supabase';

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: Date;
};

const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleLoginSuccess = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUsername('');
    setIsLoggedIn(false);
  };

  const addExpense = async () => {
    if (!description || !amount) return;

    const { error } = await supabase
      .from('expenses')
      .insert([{ description, amount: Number(amount) }]);

    if (error) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: Number(amount),
      date: new Date(),
    };

    setExpenses((prev) => [newExpense, ...prev]);

    setDescription('');
    setAmount('');
  };

  const weeklyData = useMemo(() => {
    const totals = [0, 0, 0, 0, 0, 0, 0];

    expenses.forEach((e) => {
      totals[e.date.getDay()] += e.amount;
    });

    return {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [{ data: totals }],
    };
  }, [expenses]);

  const weeklyTotal = useMemo(() => {
    return expenses.reduce((t, e) => t + e.amount, 0);
  }, [expenses]);

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1 }}>
        <AnimatedBackground />
        <Login onLoginSuccess={handleLoginSuccess} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground />

      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerTitle}>Expense Tracker</Text>
                <Text style={styles.headerSubtitle}>
                  Hello, {username} 👋
                </Text>
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Add Expense</Text>

            <TextInput
              placeholder="Expense Description"
              placeholderTextColor="#9B8CA1"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />

            <TextInput
              placeholder="Amount"
              placeholderTextColor="#9B8CA1"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />

            <TouchableOpacity style={styles.addButton} onPress={addExpense}>
              <Text style={styles.addButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Weekly Total Expenses</Text>
            <Text style={styles.totalAmount}>₱{weeklyTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Weekly Expenses</Text>

            <ScrollView horizontal>
              <LineChart
                data={weeklyData}
                width={screenWidth + 80}
                height={220}
                yAxisLabel="₱"
                chartConfig={{
                  backgroundGradientFrom: '#FFF8F5',
                  backgroundGradientTo: '#FFF8F5',
                  decimalPlaces: 0,
                  color: (o = 1) => `rgba(224,122,138,${o})`,
                  labelColor: (o = 1) => `rgba(92,84,112,${o})`,
                }}
                bezier
                style={{ borderRadius: 20 }}
              />
            </ScrollView>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>

            {expenses.length === 0 ? (
              <Text style={styles.emptyText}>No expenses added yet.</Text>
            ) : (
              <FlatList
                data={expenses}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.expenseItem}>
                    <View>
                      <Text style={styles.expenseDescription}>
                        {item.description}
                      </Text>
                      <Text style={styles.expenseDate}>
                        {item.date.toLocaleDateString()}
                      </Text>
                    </View>

                    <Text style={styles.amountText}>
                      ₱{item.amount}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>All Rights Reserved 2026</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F5',
  },

  header: {
    backgroundColor: '#F8D7DA',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5C5470',
  },

  headerSubtitle: {
    fontSize: 15,
    color: '#8E7C93',
    marginTop: 6,
  },

  logoutButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },

  logoutButtonText: {
    color: '#5C5470',
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 24,
    padding: 18,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5C5470',
    marginBottom: 16,
  },

  input: {
    backgroundColor: '#FCEEF5',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    color: '#5C5470',
  },

  addButton: {
    backgroundColor: '#F8D7DA',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5C5470',
  },

  totalCard: {
    backgroundColor: '#F8D7DA',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5C5470',
  },

  totalAmount: {
    fontSize: 34,
    fontWeight: '700',
    color: '#E07A8A',
    marginTop: 8,
  },

  emptyText: {
    textAlign: 'center',
    color: '#8E7C93',
    marginTop: 10,
  },

  expenseItem: {
    backgroundColor: '#FFF8F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C5470',
  },

  expenseDate: {
    fontSize: 12,
    color: '#8E7C93',
    marginTop: 4,
  },

  amountText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E07A8A',
  },

  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },

  footerText: {
    color: '#8E7C93',
    fontSize: 13,
  },
});