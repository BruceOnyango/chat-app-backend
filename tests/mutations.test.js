// tests/mutations.test.js
const request = require('supertest');
 // Adjust the import based on your actual app location
 const express = require('express');
 const app = express();


const { graphqlHTTP } = require('express-graphql');
const schema = require('../graphql/schema');


app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

describe('Mutation: postMessage', () => {
  it('should post a message successfully', async () => {
    // Mock the authentication token
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYnJ1Y2UiLCJpYXQiOjE3MDk4MzEyOTIsImV4cCI6MTcwOTg2NzI5Mn0.uFtwpBZcZjNkk9f8csRD7EKkWP8JCpNzghTk3WvQMPE';

    // Mock the GraphQL mutation
    const mutation = `
      mutation {
        postMessage(receiver: "bruce", message: "Hello, burce!")
      }
    `;
  

    // Mock the headers with the authentication token
    const headers = { Authorization: `Bearer ${token}` };

    // Perform the mutation
    const response = await request(app)
      .post('/graphql')
      .set(headers)
      .send({ query: mutation });
      console.log(response);

    // Validate the result
    expect(response.body.data?.postMessage).toBe('Message posted successfully!');
  });
});
