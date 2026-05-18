import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Scalable REST API with Authentication & RBAC",
    version: "1.0.0",
    description: "JWT authenticated REST API with role-based access control, Prisma, and Swagger documentation.",
  },
  servers: [
    {
      url: "/",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ["./src/modules/**/*.ts", "./src/routes/**/*.ts"],
});
