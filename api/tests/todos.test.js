const request = require('supertest');
const app = require('../src/server');

describe('Todo Endpoints', () => {
  let authToken;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({
        username: 'admin',
        password: 'password'
      });
    authToken = loginResponse.body.token;
  });

  describe('GET /items', () => {
    it('should return user todos when authenticated', async () => {
      const response = await request(app)
        .get('/items')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('completed');
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/items');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/items')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid token');
    });
  });

  describe('POST /items', () => {
    it('should create a new todo with valid data', async () => {
      const newTodo = {
        title: 'Test Todo',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTodo);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTodo.title);
      expect(response.body.description).toBe(newTodo.description);
      expect(response.body.completed).toBe(false);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should create todo with only title', async () => {
      const newTodo = {
        title: 'Minimal Todo'
      };

      const response = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTodo);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newTodo.title);
      expect(response.body.description).toBe('');
    });

    it('should reject todo creation without title', async () => {
      const newTodo = {
        description: 'No title provided'
      };

      const response = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTodo);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title is required');
    });

    it('should reject todo creation without authentication', async () => {
      const response = await request(app)
        .post('/items')
        .send({ title: 'Test Todo' });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /items/:id', () => {
    let todoId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Todo to Update',
          description: 'Original description'
        });
      todoId = createResponse.body.id;
    });

    it('should update todo title', async () => {
      const updateData = {
        title: 'Updated Todo Title'
      };

      const response = await request(app)
        .put(`/items/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe('Original description');
    });

    it('should update todo description', async () => {
      const updateData = {
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/items/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.description).toBe(updateData.description);
    });

    it('should update todo completion status', async () => {
      const updateData = {
        completed: true
      };

      const response = await request(app)
        .put(`/items/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
    });

    it('should update multiple fields at once', async () => {
      const updateData = {
        title: 'Fully Updated Todo',
        description: 'New description',
        completed: true
      };

      const response = await request(app)
        .put(`/items/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.completed).toBe(updateData.completed);
    });

    it('should reject update of non-existent todo', async () => {
      const response = await request(app)
        .put('/items/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });

    it('should reject update without authentication', async () => {
      const response = await request(app)
        .put(`/items/${todoId}`)
        .send({ title: 'Updated' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /items/:id', () => {
    let todoId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Todo to Delete',
          description: 'Will be deleted'
        });
      todoId = createResponse.body.id;
    });

    it('should delete existing todo', async () => {
      const response = await request(app)
        .delete(`/items/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Todo deleted successfully');
      expect(response.body.todo).toHaveProperty('id', todoId);
    });

    it('should reject deletion of non-existent todo', async () => {
      const response = await request(app)
        .delete('/items/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });

    it('should reject deletion without authentication', async () => {
      const response = await request(app)
        .delete(`/items/${todoId}`);

      expect(response.status).toBe(401);
    });

    it('should verify todo is actually deleted', async () => {
      await request(app)
        .delete(`/items/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`);

      const getResponse = await request(app)
        .get('/items')
        .set('Authorization', `Bearer ${authToken}`);

      const deletedTodo = getResponse.body.find(todo => todo.id === todoId);
      expect(deletedTodo).toBeUndefined();
    });
  });
});
