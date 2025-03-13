import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerTheme } from "swagger-themes";

const swaggerApiOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Documentation for Event project',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`
      },
      {
        url: process.env.SERVER_URI
      },
    ],
  },
  apis: ['./routers/**/**.js'],
};

export const swaggerApiSpec = swaggerJSDoc(swaggerApiOptions);

const theme = new SwaggerTheme();
export const options = {
  explorer: true,
  customCss: theme.getBuffer('one-dark'),
  swaggerOptions: {
    persistAuthorization: true,
  }
};