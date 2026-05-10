import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F5',
  },

  header: {
    backgroundColor: '#F8D7DA',
    paddingTop: 50,
    paddingBottom: 22,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#5C5470',
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#8E7C93',
    marginTop: 4,
  },

  logoutButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  logoutButtonText: {
    color: '#5C5470',
    fontWeight: '700',
    fontSize: 13,
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 20,
    padding: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5C5470',
    marginBottom: 14,
  },

  input: {
    backgroundColor: '#FCEEF5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    color: '#5C5470',
  },

  addButton: {
    backgroundColor: '#F8D7DA',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  addButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5C5470',
  },

  totalCard: {
    backgroundColor: '#F8D7DA',
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C5470',
  },

  totalAmount: {
    fontSize: 30,
    fontWeight: '700',
    color: '#E07A8A',
    marginTop: 6,
  },

  emptyText: {
    textAlign: 'center',
    color: '#8E7C93',
    marginTop: 10,
  },

  expenseItem: {
    backgroundColor: '#FFF8F5',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  expenseDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5C5470',
  },

  expenseDate: {
    fontSize: 11,
    color: '#8E7C93',
    marginTop: 3,
  },

  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E07A8A',
  },

  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  footerText: {
    color: '#8E7C93',
    fontSize: 12,
  },
});