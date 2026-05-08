<template>
  <div class="row mb-4">
    <div class="col-md-4">
      <div class="card text-center bg-primary text-white">
        <div class="card-body">
          <h6 class="card-title">Łącznie wydatków</h6>
          <h3 class="mb-0">{{ total.toFixed(2) }} zł</h3>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card text-center bg-success text-white">
        <div class="card-body">
          <h6 class="card-title">Liczba wpisów</h6>
          <h3 class="mb-0">{{ expenses.length }}</h3>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card text-center bg-info text-white">
        <div class="card-body">
          <h6 class="card-title">Średni wydatek</h6>
          <h3 class="mb-0">{{ average.toFixed(2) }} zł</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExpenseSummary',
  props: {
    expenses: {
      type: Array,
      required: true
    }
  },
  computed: {
    total() {
      return this.expenses.reduce((sum, e) => sum + e.amount, 0)
    },
    average() {
      if (this.expenses.length === 0) return 0
      return this.total / this.expenses.length
    }
  }
}
</script>