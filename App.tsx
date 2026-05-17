import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  Alert,
  Modal,
  Animated,
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';
import Login from './src/components/login';
import Logout from './src/components/logout';
import { supabase } from './src/components/supabase';
import { styles } from './src/components/appstyle';

type Category = 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Health' | 'Other';

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: Category;
};

const CATEGORIES: Category[] = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Other'];

const CATEGORY_ICONS: Record<Category, string> = {
  Food: '🍜',
  Transport: '🚗',
  Shopping: '🛍️',
  Bills: '📄',
  Health: '💊',
  Other: '📌',
};

const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Other');
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [budgetLimit, setBudgetLimit] = useState(5000);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState('5000');

  const [chartMode, setChartMode] = useState<'weekly' | 'monthly'>('weekly');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeAnims = useRef<Record<string, Animated.Value>>({});

  const handleLoginSuccess = async (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
    await fetchExpenses();
  };

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      setUsername(session.user.email || 'User');
      setIsLoggedIn(true);
      await fetchExpenses();
    }
  };

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUsername(session.user.email || 'User');
        setIsLoggedIn(true);
        await fetchExpenses();
      } else {
        setUsername('');
        setIsLoggedIn(false);
        setExpenses([]);
      }
    });

    return () => {
      subscription.unsubscribe();

      if (successTimer.current) {
        clearTimeout(successTimer.current);
      }
    };
  }, []);

  const fetchExpenses = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false });

    if (error) {
      console.log('Fetch error:', error.message);
      return;
    }

    if (data) {
      const formatted: Expense[] = data.map((item: any) => ({
        id: item.id.toString(),
        description: item.description,
        amount: Number(item.amount),
        date: new Date(item.created_at ?? Date.now()),
        category: (item.category as Category) ?? 'Other',
      }));

      setExpenses(formatted);
    }
  };

  const addExpense = async () => {
    if (isAdding) return;

    setAddError('');
    setAddSuccess(false);

    const trimmedDesc = description.trim();
    const parsedAmount = parseFloat(amount);

    if (!trimmedDesc) {
      setAddError('Please enter a description.');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAddError('Please enter a valid amount.');
      return;
    }

    setIsAdding(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setAddError('User not authenticated.');
      setIsAdding(false);
      return;
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          description: trimmedDesc,
          amount: parsedAmount,
          category: selectedCategory,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    setIsAdding(false);

    if (error) {
      console.log('Insert error:', error.message);
      setAddError(error.message);
      return;
    }

    const newExpense: Expense = {
      id: data.id.toString(),
      description: data.description,
      amount: Number(data.amount),
      date: new Date(data.created_at ?? Date.now()),
      category: data.category ?? 'Other',
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setDescription('');
    setAmount('');
    setSelectedCategory('Other');
    setAddSuccess(true);

    if (successTimer.current) clearTimeout(successTimer.current);

    successTimer.current = setTimeout(() => {
      setAddSuccess(false);
    }, 2500);
  };

  const deleteExpense = (id: string) => {
    Alert.alert('Delete Expense', 'Remove this transaction permanently?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeletingId(id);

          if (!fadeAnims.current[id]) {
            fadeAnims.current[id] = new Animated.Value(1);
          }

          Animated.timing(fadeAnims.current[id], {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start(async () => {
            const { error } = await supabase
              .from('expenses')
              .delete()
              .eq('id', Number(id));

            if (error) {
              Alert.alert('Error', error.message);

              Animated.timing(fadeAnims.current[id], {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }).start();

              setDeletingId(null);
              return;
            }

            setExpenses((prev) => prev.filter((e) => e.id !== id));
            delete fadeAnims.current[id];
            setDeletingId(null);
          });
        },
      },
    ]);
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

  const monthlyData = useMemo(() => {
    const weeks = [0, 0, 0, 0];

    expenses.forEach((e) => {
      const week = Math.min(Math.floor((e.date.getDate() - 1) / 7), 3);
      weeks[week] += e.amount;
    });

    return {
      labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
      datasets: [{ data: weeks }],
    };
  }, [expenses]);

  const totalSpent = useMemo(() => {
    return expenses.reduce((t, e) => t + e.amount, 0);
  }, [expenses]);

  const budgetUsedPercent = Math.min((totalSpent / budgetLimit) * 100, 100);
  const budgetRemaining = Math.max(budgetLimit - totalSpent, 0);
  const isOverBudget = totalSpent > budgetLimit;

  const filteredExpenses = useMemo(() => {
    if (filterCategory === 'All') return expenses;
    return expenses.filter((e) => e.category === filterCategory);
  }, [expenses, filterCategory]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    CATEGORIES.forEach((c) => {
      totals[c] = 0;
    });

    expenses.forEach((e) => {
      totals[e.category] += e.amount;
    });

    return totals;
  }, [expenses]);

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const chartData = chartMode === 'weekly' ? weeklyData : monthlyData;

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Vault</Text>
              <Text style={styles.headerSubtitle}>Hey, {username} 👋</Text>
            </View>

            <Logout
  onLogoutSuccess={() => {
    setUsername('');
    setExpenses([]);
    setDescription('');
    setAmount('');
    setSelectedCategory('Other');
    setFilterCategory('All');
    setAddError('');
    setAddSuccess(false);
    setIsLoggedIn(false);
  }}
/>
          </View>

          <View style={[styles.budgetCard, isOverBudget && styles.budgetCardDanger]}>
            <View style={styles.budgetRow}>
              <View>
                <Text style={styles.budgetLabel}>Monthly Budget</Text>
                <Text style={styles.budgetAmount}>₱{budgetLimit.toLocaleString()}</Text>
              </View>

              <TouchableOpacity
                style={styles.editBudgetBtn}
                onPress={() => setShowBudgetModal(true)}
              >
                <Text style={styles.editBudgetText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${budgetUsedPercent}%` as any },
                  isOverBudget && styles.progressDanger,
                ]}
              />
            </View>

            <View style={styles.budgetStats}>
              <View>
                <Text style={styles.statLabel}>Spent</Text>
                <Text style={[styles.statValue, isOverBudget && styles.dangerText]}>
                  ₱{totalSpent.toFixed(2)}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.statLabel}>Remaining</Text>
                <Text style={[styles.statValue, isOverBudget && styles.dangerText]}>
                  {isOverBudget
                    ? `Over by ₱${(totalSpent - budgetLimit).toFixed(2)}`
                    : `₱${budgetRemaining.toFixed(2)}`}
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScrollRow}
          >
            {CATEGORIES.map((cat) => (
              <View key={cat} style={styles.categoryChip}>
                <Text style={styles.categoryChipIcon}>{CATEGORY_ICONS[cat]}</Text>
                <Text style={styles.categoryChipLabel}>{cat}</Text>
                <Text style={styles.categoryChipAmount}>
                  ₱{(categoryTotals[cat] || 0).toFixed(0)}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Add Expense</Text>

            <TextInput
              placeholder="Description"
              placeholderTextColor="#6B7FA3"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setAddError('');
              }}
              style={styles.input}
            />

            <TextInput
              placeholder="Amount (₱)"
              placeholderTextColor="#6B7FA3"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                setAmount(cleaned);
                setAddError('');
              }}
              style={styles.input}
            />

            <Text style={styles.pickerLabel}>Category</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryPill,
                    selectedCategory === cat && styles.categoryPillActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      selectedCategory === cat && styles.categoryPillTextActive,
                    ]}
                  >
                    {CATEGORY_ICONS[cat]} {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {addError ? (
              <View style={styles.formErrorBox}>
                <Text style={styles.formErrorText}>⚠ {addError}</Text>
              </View>
            ) : null}

            {addSuccess ? (
              <View style={styles.formSuccessBox}>
                <Text style={styles.formSuccessText}>✓ Expense added successfully!</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.addButton, isAdding && styles.addButtonDisabled]}
              onPress={addExpense}
              disabled={isAdding}
            >
              <Text style={styles.addButtonText}>
                {isAdding ? 'Saving...' : '+ Add Expense'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.chartHeader}>
              <Text style={styles.sectionTitle}>Spending Trend</Text>

              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleBtn, chartMode === 'weekly' && styles.toggleBtnActive]}
                  onPress={() => setChartMode('weekly')}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      chartMode === 'weekly' && styles.toggleTextActive,
                    ]}
                  >
                    Week
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.toggleBtn, chartMode === 'monthly' && styles.toggleBtnActive]}
                  onPress={() => setChartMode('monthly')}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      chartMode === 'monthly' && styles.toggleTextActive,
                    ]}
                  >
                    Month
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView horizontal>
              <LineChart
                data={chartData}
                width={screenWidth + 60}
                height={200}
                yAxisLabel="₱"
                chartConfig={{
                  backgroundGradientFrom: '#0F1A2E',
                  backgroundGradientTo: '#0F1A2E',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(200, 165, 90, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(160, 185, 220, ${opacity})`,
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: '#C8A55A',
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: 'rgba(255,255,255,0.05)',
                  },
                }}
                bezier
                style={{ borderRadius: 16 }}
              />
            </ScrollView>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Transactions</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {(['All', ...CATEGORIES] as (Category | 'All')[]).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.filterTab, filterCategory === cat && styles.filterTabActive]}
                  onPress={() => setFilterCategory(cat)}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      filterCategory === cat && styles.filterTabTextActive,
                    ]}
                  >
                    {cat === 'All' ? '🗂 All' : `${CATEGORY_ICONS[cat]} ${cat}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filteredExpenses.length === 0 ? (
              <Text style={styles.emptyText}>No expenses here yet.</Text>
            ) : (
              <FlatList
                data={filteredExpenses}
                scrollEnabled={false}
                nestedScrollEnabled
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  if (!fadeAnims.current[item.id]) {
                    fadeAnims.current[item.id] = new Animated.Value(1);
                  }

                  const isDeleting = deletingId === item.id;

                  return (
                    <Animated.View
                      style={[
                        styles.expenseItem,
                        { opacity: fadeAnims.current[item.id] },
                      ]}
                    >
                      <View style={styles.expenseCategoryDot}>
                        <Text style={{ fontSize: 18 }}>
                          {CATEGORY_ICONS[item.category]}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.expenseDescription}>{item.description}</Text>
                        <Text style={styles.expenseDate}>
                          {item.category} · {item.date.toLocaleDateString()}
                        </Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.amountText}>₱{item.amount.toFixed(2)}</Text>

                        <TouchableOpacity
                          onPress={() => deleteExpense(item.id)}
                          disabled={isDeleting}
                          style={[styles.deleteBtn, isDeleting && styles.deleteBtnDisabled]}
                        >
                          <Text
                            style={[
                              styles.deleteText,
                              isDeleting && styles.deleteTextDeleting,
                            ]}
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  );
                }}
              />
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Vault · All Rights Reserved 2026</Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={showBudgetModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Set Budget Limit</Text>

            <TextInput
              value={budgetInput}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                setBudgetInput(cleaned);
              }}
              keyboardType="numeric"
              style={styles.modalInput}
              placeholder="e.g. 5000"
              placeholderTextColor="#6B7FA3"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowBudgetModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSave}
                onPress={() => {
                  const val = Number(budgetInput);

                  if (!budgetInput.trim() || isNaN(val) || val <= 0) {
                    Alert.alert('Invalid Budget', 'Please enter a valid budget.');
                    return;
                  }

                  setBudgetLimit(val);
                  setShowBudgetModal(false);
                }}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}