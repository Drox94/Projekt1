<template>
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Lista wydatków</h5>
      <span class="badge bg-secondary">{{ expenses.length }} pozycji</span>
    </div>
    <div class="card-body">
      <p v-if="expenses.length === 0" class="text-muted text-center mb-0">
        Brak wydatków. Dodaj swój pierwszy wydatek powyżej.
      </p>
      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Data</th>
              <th>Kategoria</th>
              <th>Opis</th>
              <th class="text-end">Kwota</th>
              <th class="text-center">Akcje</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in expenses" :key="expense.id">
              <td>{{ formatDate(expense.date) }}</td>
              <td>
                <span class="badge" :class="categoryClass(expense.category)">
                  {{ expense.category }}
                </span>
              </td>
              <td>{{ expense.description || '-' }}</td>
              <td class="text-end fw-bold">{{ expense.amount.toFixed(2) }} zł</td>
              <td class="text-center">
                <button @click="$emit('edit', expense)" class="btn btn-sm btn-outline-primary me-1">
                  Edytuj
                </button>
                <button @click="confirmDelete(expense)" class="btn btn-sm btn-outline-danger">
                  Usuń
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExpenseList',
  props: {
    expenses: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  emits: ['edit', 'delete'],
  methods: {
    formatDate(dateStr) {
      const d = new Date(dateStr)
      return d.toLocaleDateString('pl-PL')
    },
    categoryClass(category) {
      const found = this.categories.find(c => c.name === category)
      return found ? found.color : 'bg-secondary'
    },
    confirmDelete(expense) {
      if (confirm(`Czy na pewno usunąć wydatek "${expense.description || expense.category}" (${expense.amount.toFixed(2)} zł)?`)) {
        this.$emit('delete', expense.id)
      }
    }
  }
}
</script>