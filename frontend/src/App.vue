<template>
  <div class="container py-4">
    <header class="mb-4 text-center">
      <h1 class="display-5">💰 Rejestr Domowych Wydatków</h1>
      <p class="text-muted">Zarządzaj swoimi wydatkami w prosty sposób</p>
    </header>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <ExpenseSummary :expenses="expenses" />

    <CategoryManager
      :categories="categories"
      @added="addCategory"
      @deleted="deleteCategory"
    />

    <ExpenseForm
      :expense-to-edit="editingExpense"
      :categories="categories"
      @saved="handleSave"
      @cancel="cancelEdit"
    />

    <ExpenseList
      :expenses="expenses"
      :categories="categories"
      @edit="startEdit"
      @delete="deleteExpense"
    />

    <footer class="mt-5 text-center text-muted">
      <small>Projekt zaliczeniowy - Zaawansowane programowanie WWW</small>
    </footer>
  </div>
</template>

<script>
import ExpenseList from './components/ExpenseList.vue'
import ExpenseForm from './components/ExpenseForm.vue'
import ExpenseSummary from './components/ExpenseSummary.vue'
import CategoryManager from './components/CategoryManager.vue'
import { expensesApi, categoriesApi } from './api.js'

export default {
  name: 'App',
  components: {
    ExpenseList,
    ExpenseForm,
    ExpenseSummary,
    CategoryManager
  },
  data() {
    return {
      expenses: [],
      categories: [],
      editingExpense: null,
      error: null
    }
  },
  mounted() {
    this.loadCategories()
    this.loadExpenses()
  },
  methods: {
    async loadExpenses() {
      try {
        const response = await expensesApi.getAll()
        this.expenses = response.data
        this.error = null
      } catch (err) {
        this.error = 'Błąd ładowania wydatków: ' + err.message
      }
    },
    async loadCategories() {
      try {
        const response = await categoriesApi.getAll()
        this.categories = response.data
      } catch (err) {
        this.error = 'Błąd ładowania kategorii: ' + err.message
      }
    },
    async handleSave(expense) {
      try {
        if (this.editingExpense) {
          await expensesApi.update(this.editingExpense.id, expense)
          this.editingExpense = null
        } else {
          await expensesApi.create(expense)
        }
        await this.loadExpenses()
      } catch (err) {
        this.error = 'Błąd zapisu: ' + err.message
      }
    },
    startEdit(expense) {
      this.editingExpense = { ...expense }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    cancelEdit() {
      this.editingExpense = null
    },
    async deleteExpense(id) {
      try {
        await expensesApi.delete(id)
        await this.loadExpenses()
      } catch (err) {
        this.error = 'Błąd usuwania: ' + err.message
      }
    },
    async addCategory(category, callback) {
      try {
        await categoriesApi.create(category)
        await this.loadCategories()
        callback(null)
      } catch (err) {
        const msg = err.response?.data?.error || err.message
        callback(msg)
      }
    },
    async deleteCategory(id) {
      try {
        await categoriesApi.delete(id)
        await this.loadCategories()
      } catch (err) {
        this.error = 'Błąd usuwania kategorii: ' + err.message
      }
    }
  }
}
</script>

<style>
body {
  background-color: #f5f7fa;
}
</style>