import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';

import Login from './src/components/login';
import { supabase } from './src/components/supabase';

import { styles } from './src/components/appstyle';

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

  // LOGIN SUCCESS
  const handleLoginSuccess = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
  };

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUsername('');
    setIsLoggedIn(false);
    setExpenses([]);
  };

  // 🔥 FETCH EXPENSES FROM SUPABASE
  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.log('Fetch error:', error);
      return;
    }

    if (data) {
      const formatted: Expense[] = data.map((item: any) => ({
        id: item.id.toString(),
        description: item.description,
        amount: item.amount,
        date: new Date(item.created_at ?? Date.now()),
      }));

      setExpenses(formatted);
    }
  };

  // LOAD DATA AFTER LOGIN
  useEffect(() => {
    if (isLoggedIn) {
      fetchExpenses();
    }
  }, [isLoggedIn]);

  // ADD EXPENSE
  const addExpense = async () => {
    if (!description || !amount) return;

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          description,
          amount: Number(amount),
        },
      ])
      .select()
      .single();

    if (error) {
      console.log(error);
      return;
    }

    const newExpense: Expense = {
      id: data.id.toString(),
      description: data.description,
      amount: data.amount,
      date: new Date(data.created_at ?? Date.now()),
    };

    setExpenses((prev) => [newExpense, ...prev]);

    setDescription('');
    setAmount('');
  };

  // WEEKLY DATA
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

  // TOTAL
  const weeklyTotal = useMemo(() => {
    return expenses.reduce((t, e) => t + e.amount, 0);
  }, [expenses]);

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1 }}>
        <Login onLoginSuccess={handleLoginSuccess} />
      </View>
    );
  }

  // MAIN APP
  return (
    <View style={{ flex: 1 }}>

      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>
                  Expense Tracker
                </Text>
                <Text style={styles.headerSubtitle}>
                  Hello, {username} 👋
                </Text>
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ADD EXPENSE */}
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

            <TouchableOpacity
              style={styles.addButton}
              onPress={addExpense}
            >
              <Text style={styles.addButtonText}>
                Add Expense
              </Text>
            </TouchableOpacity>
          </View>

          {/* TOTAL */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>
              Weekly Total Expenses
            </Text>
            <Text style={styles.totalAmount}>
              ₱{weeklyTotal.toFixed(2)}
            </Text>
          </View>

          {/* GRAPH */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Weekly Expenses
            </Text>

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
                  color: (o = 1) =>
                    `rgba(224,122,138,${o})`,
                  labelColor: (o = 1) =>
                    `rgba(92,84,112,${o})`,
                }}
                bezier
                style={{ borderRadius: 20 }}
              />
            </ScrollView>
          </View>

          {/* LIST */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Recent Expenses
            </Text>

            {expenses.length === 0 ? (
              <Text style={styles.emptyText}>
                No expenses added yet.
              </Text>
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
            <Text style={styles.footerText}>
              All Rights Reserved 2026
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}