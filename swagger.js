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
    servers:[
      {
        url:'http://10.24.89.9:3011/api',
        description:'Base path for all endpoints'
      }

    ]
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
 swaggerUi,  swaggerSpec
};



/*const swaggerJSDoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MOSPI NISD PORTAL API",
      version: "1.0.0",
      description: "API for internship portal",
    },
    servers: [
      {
        url: "http://localhost:3011", 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"] 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;*/
