<template>
  <div class="card mb-4">
    <div class="card-header">
      <h5 class="mb-0">{{ editMode ? 'Edytuj wydatek' : 'Dodaj nowy wydatek' }}</h5>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-md-3 mb-3">
            <label class="form-label">Kategoria</label>
            <select v-model="form.category" class="form-select" required>
              <option value="">-- wybierz --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="col-md-2 mb-3">
            <label class="form-label">Kwota (zł)</label>
            <input v-model.number="form.amount" type="number" step="0.01" class="form-control" required />
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label">Data</label>
            <input v-model="form.date" type="date" class="form-control" required />
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">Opis</label>
            <input v-model="form.description" type="text" class="form-control" placeholder="np. Zakupy w Biedronce" />
          </div>
        </div>
        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary">
            {{ editMode ? 'Zapisz zmiany' : 'Dodaj wydatek' }}
          </button>
          <button v-if="editMode" type="button" class="btn btn-secondary" @click="cancelEdit">
            Anuluj
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExpenseForm',
  props: {
    expenseToEdit: {
      type: Object,
      default: null
    },
    categories: {
      type: Array,
      required: true
    }
  },
  emits: ['saved', 'cancel'],
  data() {
    return {
      form: {
        category: '',
        amount: null,
        description: '',
        date: new Date().toISOString().split('T')[0]
      }
    }
  },
  computed: {
    editMode() {
      return this.expenseToEdit !== null
    }
  },
  watch: {
    expenseToEdit(newVal) {
      if (newVal) {
        this.form = { ...newVal }
      } else {
        this.resetForm()
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('saved', { ...this.form })
      if (!this.editMode) {
        this.resetForm()
      }
    },
    cancelEdit() {
      this.$emit('cancel')
      this.resetForm()
    },
    resetForm() {
      this.form = {
        category: '',
        amount: null,
        description: '',
        date: new Date().toISOString().split('T')[0]
      }
    }
  }
}
</script>