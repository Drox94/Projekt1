<template>
  <div class="card mb-4">
    <div class="card-header d-flex justify-content-between align-items-center" style="cursor: pointer" @click="expanded = !expanded">
      <h5 class="mb-0">Zarządzaj kategoriami</h5>
      <span>{{ expanded ? '▲' : '▼' }}</span>
    </div>
    <div v-if="expanded" class="card-body">
      <form @submit.prevent="addCategory" class="mb-3">
        <div class="row g-2">
          <div class="col-md-5">
            <input
              v-model="newCategory.name"
              type="text"
              class="form-control"
              placeholder="Nazwa nowej kategorii"
              required
            />
          </div>
          <div class="col-md-4">
            <select v-model="newCategory.color" class="form-select">
              <option value="bg-success">🟢 Zielony</option>
              <option value="bg-info">🔵 Niebieski</option>
              <option value="bg-warning text-dark">🟡 Żółty</option>
              <option value="bg-danger">🔴 Czerwony</option>
              <option value="bg-primary">🔷 Granatowy</option>
              <option value="bg-secondary">⚪ Szary</option>
              <option value="bg-dark">⚫ Czarny</option>
            </select>
          </div>
          <div class="col-md-3">
            <button type="submit" class="btn btn-success w-100">Dodaj kategorię</button>
          </div>
        </div>
        <div v-if="error" class="alert alert-danger mt-2 mb-0 py-2">{{ error }}</div>
      </form>

      <div class="d-flex flex-wrap gap-2">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="d-flex align-items-center"
        >
          <span class="badge me-1" :class="cat.color">{{ cat.name }}</span>
          <button
            @click="removeCategory(cat)"
            class="btn btn-sm btn-outline-danger py-0 px-2"
            title="Usuń kategorię"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryManager',
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  emits: ['added', 'deleted'],
  data() {
    return {
      expanded: false,
      newCategory: {
        name: '',
        color: 'bg-secondary'
      },
      error: null
    }
  },
  methods: {
    addCategory() {
      this.error = null
      this.$emit('added', { ...this.newCategory }, (err) => {
        if (err) {
          this.error = err
        } else {
          this.newCategory = { name: '', color: 'bg-secondary' }
        }
      })
    },
    removeCategory(cat) {
      if (confirm(`Czy na pewno usunąć kategorię "${cat.name}"?\n(Istniejące wydatki w tej kategorii pozostaną nietknięte)`)) {
        this.$emit('deleted', cat.id)
      }
    }
  }
}
</script>