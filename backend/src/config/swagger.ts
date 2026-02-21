// ============================================================
// FILE: src/config/swagger.ts
// PURPOSE: Swagger configuration — defines API documentation
//          structure, security schemes, and server info.
// ============================================================

import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Secure Task Management API",
      version: "1.0.0",
      description:
        "A secure REST API for managing tasks with JWT authentication. All task endpoints require a valid Bearer token.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    // ── Security Scheme ──────────────────────────────────────
    // Defines Bearer token auth for the entire API
    // Once defined here, each route can reference it with security: []
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token from the login response",
        },
      },
      // ── Reusable Schemas ───────────────────────────────────
      // These schemas are referenced by route definitions below
      schemas: {
        // User registration request body
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              example: "Lithika",
            },
            email: {
              type: "string",
              format: "email",
              example: "lithika@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "SecurePass@123",
            },
          },
        },
        // Login request body
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "lithika@example.com",
            },
            password: {
              type: "string",
              example: "SecurePass@123",
            },
          },
        },
        // Task creation/update request body
        TaskRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              example: "Complete project report",
            },
            description: {
              type: "string",
              example: "Write the final section of the report",
            },
            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
              example: "pending",
            },
            dueDate: {
              type: "string",
              format: "date",
              example: "2025-06-15",
            },
          },
        },
        // Task response object
        Task: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64a2f1b3dfda087919da760c",
            },
            title: {
              type: "string",
              example: "Complete project report",
            },
            description: {
              type: "string",
              example: "Write the final section",
            },
            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
              example: "pending",
            },
            dueDate: {
              type: "string",
              example: "2025-06-15",
            },
            user: {
              type: "string",
              example: "64a1c...",
            },
            createdAt: {
              type: "string",
              example: "2025-01-15T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              example: "2025-01-15T10:30:00.000Z",
            },
          },
        },
        // Error response
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Invalid credentials",
            },
          },
        },
      },
    },
  },
  // Where to look for JSDoc comments — scans all route files
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;