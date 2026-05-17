import { StyleSheet } from 'react-native';

/* ─── Design Tokens ─────────────────────────────────────────────
   Palette: Deep Navy + Gold + Slate
   --navy-deep:   #070E1C
   --navy-card:   #0F1A2E
   --navy-border: #1A2A45
   --gold:        #C8A55A
   --gold-light:  #E8C97A
   --slate:       #A0B9DC
   --text:        #EAF0FB
   --text-muted:  #6B7FA3
   --danger:      #E05A5A
   --success:     #4CAF7D
─────────────────────────────────────────────────────────────── */

export const styles = StyleSheet.create({

  // ── Container ──────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: '#070E1C',
  },

  // ── Header ─────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#C8A55A',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7FA3',
    marginTop: 2,
    letterSpacing: 0.4,
  },

  // ── Logout Button ───────────────────────────────────────────
  logoutButton: {
    borderWidth: 1,
    borderColor: '#1A2A45',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 16,
    backgroundColor: '#0F1A2E',
  },
  logoutButtonText: {
    fontSize: 13,
    color: '#6B7FA3',
    fontWeight: '500',
  },

  // ── Budget Card ─────────────────────────────────────────────
  budgetCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#0F1A2E',
    borderWidth: 1,
    borderColor: '#1A2A45',
  },
  budgetCardDanger: {
    borderColor: '#E05A5A',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  budgetLabel: {
    fontSize: 12,
    color: '#6B7FA3',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EAF0FB',
    letterSpacing: -0.5,
  },
  editBudgetBtn: {
    borderWidth: 1,
    borderColor: '#C8A55A',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  editBudgetText: {
    fontSize: 12,
    color: '#C8A55A',
    fontWeight: '600',
  },

  // Progress Bar
  progressTrack: {
    height: 6,
    backgroundColor: '#1A2A45',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C8A55A',
    borderRadius: 3,
  },
  progressDanger: {
    backgroundColor: '#E05A5A',
  },

  budgetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7FA3',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EAF0FB',
  },
  dangerText: {
    color: '#E05A5A',
  },

  // ── Category Summary Scroll ─────────────────────────────────
  categoryScrollRow: {
    paddingLeft: 16,
    marginBottom: 14,
  },
  categoryChip: {
    backgroundColor: '#0F1A2E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1A2A45',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  categoryChipIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  categoryChipLabel: {
    fontSize: 10,
    color: '#6B7FA3',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  categoryChipAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C8A55A',
  },

  // ── Generic Card ────────────────────────────────────────────
  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#0F1A2E',
    borderWidth: 1,
    borderColor: '#1A2A45',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A0B9DC',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },

  // ── Input ───────────────────────────────────────────────────
  input: {
    backgroundColor: '#070E1C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A2A45',
    color: '#EAF0FB',
    paddingVertical: 13,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 10,
  },

  // ── Category Picker (in Add form) ───────────────────────────
  pickerLabel: {
    fontSize: 11,
    color: '#6B7FA3',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  categoryPill: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1A2A45',
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginRight: 8,
    backgroundColor: '#070E1C',
  },
  categoryPillActive: {
    backgroundColor: '#C8A55A',
    borderColor: '#C8A55A',
  },
  categoryPillText: {
    fontSize: 13,
    color: '#6B7FA3',
    fontWeight: '500',
  },
  categoryPillTextActive: {
    color: '#070E1C',
    fontWeight: '700',
  },

  // ── Add Button ──────────────────────────────────────────────
  addButton: {
    backgroundColor: '#C8A55A',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#070E1C',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },

  // ── Form Feedback ────────────────────────────────────────────
  inputError: {
    borderColor: '#E05A5A',
  },
  formErrorBox: {
    backgroundColor: '#1A0E0E',
    borderWidth: 1,
    borderColor: '#E05A5A',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  formErrorText: {
    color: '#E05A5A',
    fontSize: 13,
    fontWeight: '600',
  },
  formSuccessBox: {
    backgroundColor: '#0A1A10',
    borderWidth: 1,
    borderColor: '#4CAF7D',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  formSuccessText: {
    color: '#4CAF7D',
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Chart Header / Toggle ───────────────────────────────────
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#070E1C',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: '#1A2A45',
  },
  toggleBtn: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#C8A55A',
  },
  toggleText: {
    fontSize: 12,
    color: '#6B7FA3',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#070E1C',
  },

  // ── Filter Tabs ─────────────────────────────────────────────
  filterTab: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1A2A45',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: '#070E1C',
  },
  filterTabActive: {
    backgroundColor: '#1A2A45',
    borderColor: '#A0B9DC',
  },
  filterTabText: {
    fontSize: 12,
    color: '#6B7FA3',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#EAF0FB',
  },

  // ── Expense List Item ───────────────────────────────────────
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2A45',
    gap: 12,
  },
  expenseCategoryDot: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1A2A45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EAF0FB',
    marginBottom: 3,
  },
  expenseDate: {
    fontSize: 11,
    color: '#6B7FA3',
    letterSpacing: 0.3,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C8A55A',
  },
  deleteText: {
    fontSize: 11,
    color: '#E05A5A',
    fontWeight: '500',
  },
  deleteBtn: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#E05A5A',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  deleteBtnDisabled: {
    borderColor: '#3A4D6B',
    opacity: 0.5,
  },
  deleteTextDeleting: {
    color: '#6B7FA3',
  },

  emptyText: {
    color: '#6B7FA3',
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 13,
    fontStyle: 'italic',
  },

  // ── Footer ──────────────────────────────────────────────────
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 11,
    color: '#1A2A45',
    letterSpacing: 1,
  },

  // ── Budget Modal ─────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7,14,28,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#0F1A2E',
    borderRadius: 24,
    padding: 28,
    width: '80%',
    borderWidth: 1,
    borderColor: '#1A2A45',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EAF0FB',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  modalInput: {
    backgroundColor: '#070E1C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A2A45',
    color: '#EAF0FB',
    paddingVertical: 13,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancel: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#1A2A45',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#6B7FA3',
    fontWeight: '600',
    fontSize: 14,
  },
  modalSave: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    backgroundColor: '#C8A55A',
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#070E1C',
    fontWeight: '800',
    fontSize: 14,
  },

  // ── Legacy / kept for backwards compat ─────────────────────
  totalCard: {
    display: 'none',
  } as any,
  totalLabel: {
    display: 'none',
  } as any,
  totalAmount: {
    display: 'none',
  } as any,
});