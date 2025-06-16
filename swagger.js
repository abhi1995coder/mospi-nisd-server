const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  }
},
security: [{
  bearerAuth: []
}],

    openapi: '3.0.0',
    info: {
      title: 'MOSPI NISD PORTAL API',
      version: '1.0.0',
      description: 'API for internship portal',
    },
  },
  apis: ['./routes/*.js'], // update path if your route files are elsewhere
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec
};
