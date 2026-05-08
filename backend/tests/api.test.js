const request = require('supertest');
const app = require('../app');

describe('API Wydatków', () => {
  let createdExpenseId;

  // GET /api/expenses
  test('GET /api/expenses zwraca tablicę wydatków', async () => {
    const response = await request(app).get('/api/expenses');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // POST /api/expenses
  test('POST /api/expenses tworzy nowy wydatek', async () => {
    const newExpense = {
      category: 'jedzenie',
      amount: 25.50,
      description: 'Test - obiad',
      date: '2026-05-08'
    };

    const response = await request(app)
      .post('/api/expenses')
      .send(newExpense);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.category).toBe('jedzenie');
    expect(response.body.amount).toBe(25.50);

    createdExpenseId = response.body.id;
  });

  // POST z brakującymi danymi
  test('POST /api/expenses zwraca 400 gdy brakuje pól', async () => {
    const response = await request(app)
      .post('/api/expenses')
      .send({ description: 'Brakuje category, amount i date' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  // GET /api/expenses/:id
  test('GET /api/expenses/:id zwraca konkretny wydatek', async () => {
    const response = await request(app).get(`/api/expenses/${createdExpenseId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(createdExpenseId);
  });

  // GET nieistniejącego
  test('GET /api/expenses/:id zwraca 404 dla nieistniejącego id', async () => {
    const response = await request(app).get('/api/expenses/999999');
    expect(response.statusCode).toBe(404);
  });

  // PUT /api/expenses/:id
  test('PUT /api/expenses/:id aktualizuje wydatek', async () => {
    const updated = {
      category: 'transport',
      amount: 50.00,
      description: 'Test - zaktualizowany',
      date: '2026-05-08'
    };

    const response = await request(app)
      .put(`/api/expenses/${createdExpenseId}`)
      .send(updated);

    expect(response.statusCode).toBe(200);
    expect(response.body.category).toBe('transport');
    expect(response.body.amount).toBe(50.00);
  });

  // DELETE /api/expenses/:id
  test('DELETE /api/expenses/:id usuwa wydatek', async () => {
    const response = await request(app).delete(`/api/expenses/${createdExpenseId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  // DELETE nieistniejącego
  test('DELETE /api/expenses/:id zwraca 404 dla nieistniejącego id', async () => {
    const response = await request(app).delete('/api/expenses/999999');
    expect(response.statusCode).toBe(404);
  });
});

describe('API Kategorii', () => {
  // GET /api/categories
  test('GET /api/categories zwraca tablicę kategorii', async () => {
    const response = await request(app).get('/api/categories');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // POST /api/categories
  test('POST /api/categories tworzy nową kategorię', async () => {
    const uniqueName = 'test-kategoria-' + Date.now();
    const response = await request(app)
      .post('/api/categories')
      .send({ name: uniqueName, color: 'bg-success' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(uniqueName);

    // Cleanup
    await request(app).delete(`/api/categories/${response.body.id}`);
  });

  // POST z pustą nazwą
  test('POST /api/categories zwraca 400 gdy brakuje nazwy', async () => {
    const response = await request(app)
      .post('/api/categories')
      .send({ color: 'bg-info' });

    expect(response.statusCode).toBe(400);
  });

  // POST duplikatu
  test('POST /api/categories zwraca 400 dla zduplikowanej nazwy', async () => {
    const uniqueName = 'duplikat-test-' + Date.now();

    const first = await request(app)
      .post('/api/categories')
      .send({ name: uniqueName });

    const second = await request(app)
      .post('/api/categories')
      .send({ name: uniqueName });

    expect(second.statusCode).toBe(400);

    // Cleanup
    await request(app).delete(`/api/categories/${first.body.id}`);
  });
});