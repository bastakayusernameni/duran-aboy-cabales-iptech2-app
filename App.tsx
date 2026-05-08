import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

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

import { supabase } from './src/components/supabase';

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: Date;
};

const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [description, setDescription] =
    useState('');

  const [amount, setAmount] = useState('');

  const [expenses, setExpenses] = useState<
    Expense[]
  >([]);

  // Fetch Expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const { data, error } =
      await supabase
        .from('expenses')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

    if (error) {
      console.log(
        'Fetch Error:',
        error
      );
      return;
    }

    const formattedExpenses =
      data.map((item: any) => ({
        id: item.id.toString(),
        description: item.description,
        amount: item.amount,
        date: new Date(item.created_at),
      }));

    setExpenses(formattedExpenses);
  };

  // Add Expense
  const addExpense = async () => {
    if (!description || !amount) {
      return;
    }

    const newExpense = {
      description,
      amount: Number(amount),
    };

    const { data, error } =
      await supabase
        .from('expenses')
        .insert([newExpense]);

    if (error) {
      console.log(
        'Supabase Insert Error:',
        error
      );
      return;
    }

    console.log(
      'Expense Saved:',
      data
    );

    await fetchExpenses();

    setDescription('');
    setAmount('');
  };

  // Weekly Graph Data
  const weeklyData = useMemo(() => {
    const totals = [0, 0, 0, 0, 0, 0, 0];

    expenses.forEach((expense) => {
      const day = expense.date.getDay();

      totals[day] += expense.amount;
    });

    return {
      labels: [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
      ],

      datasets: [
        {
          data: totals,
        },
      ],
    };
  }, [expenses]);

  // Weekly Total
  const weeklyTotal = useMemo(() => {
    return expenses.reduce(
      (total, expense) =>
        total + expense.amount,
      0
    );
  }, [expenses]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Expense Tracker
          </Text>

          <Text style={styles.headerSubtitle}>
            Track your weekly spending
          </Text>
        </View>

        {/* Add Expense */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Add Expense
          </Text>

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

        {/* Weekly Total */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            Weekly Total Expenses
          </Text>

          <Text style={styles.totalAmount}>
            ₱{weeklyTotal.toFixed(2)}
          </Text>
        </View>

        {/* Weekly Graph */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Weekly Expenses
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
          >
            <LineChart
              data={weeklyData}
              width={screenWidth + 80}
              height={220}
              yAxisLabel="₱"
              chartConfig={{
                backgroundGradientFrom:
                  '#FFF8F5',

                backgroundGradientTo:
                  '#FFF8F5',

                decimalPlaces: 0,

                color: (opacity = 1) =>
                  `rgba(224,122,138,${opacity})`,

                labelColor: (opacity = 1) =>
                  `rgba(92,84,112,${opacity})`,

                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#E07A8A',
                },
              }}
              bezier
              style={{
                borderRadius: 20,
                marginRight: 20,
              }}
            />
          </ScrollView>
        </View>

        {/* Expense List */}
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
              scrollEnabled={false}
              data={expenses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.expenseItem}>
                  <View>
                    <Text
                      style={
                        styles.expenseDescription
                      }
                    >
                      {item.description}
                    </Text>

                    <Text
                      style={styles.expenseDate}
                    >
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
      </ScrollView>
    </SafeAreaView>
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

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 24,
    padding: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  totalCard: {
    backgroundColor: '#F8D7DA',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 24,
    paddingVertical: 24,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5C5470',
    marginBottom: 8,
  },

  totalAmount: {
    fontSize: 34,
    fontWeight: '700',
    color: '#E07A8A',
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#5C5470',
    marginBottom: 12,
  },

  addButton: {
    backgroundColor: '#F8D7DA',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5C5470',
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
    alignItems: 'center',
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
});