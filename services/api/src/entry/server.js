require("dotenv").config();

const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

// Enable CORS
app.use(cors());

// Allow Express to read JSON request bodies
app.use(express.json());

const PORT = process.env.PORT || 5000;


// ======================================================
// VALIDATION SCHEMAS
// ======================================================

// Registration validation
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Login validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  deadline: z.string().datetime().optional(),
});


// ======================================================
// AUTHENTICATION MIDDLEWARE
// ======================================================

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check whether Authorization header exists
    // and follows: Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Extract token from:
    // Authorization: Bearer <token>
    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store authenticated user's information
    // on the request object for the next handler
    req.user = {
      userId: decoded.userId,
    };

    // Authentication successful.
    // Continue to the actual route.
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};


// ======================================================
// BASIC ROUTES
// ======================================================

app.get("/", (req, res) => {
  res.send(" Welcome to Project FootPrint Backend!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Project FootPrint API",
    version: "1.0.0",
  });
});


// ======================================================
// REGISTRATION
// ======================================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid registration data",
        errors: result.error.issues,
      });
    }

    const { name, email, password } = result.data;

    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in PostgreSQL using Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


// ======================================================
// LOGIN
// ======================================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid login data",
        errors: result.error.issues,
      });
    }

    const { email, password } = result.data;

    // Find user using email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Do not reveal whether the email exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare entered password with stored hashed password
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


// ======================================================
// GET CURRENT AUTHENTICATED USER
// ======================================================

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ======================================================
// CREATE PROJECT / WORKSPACE
// ======================================================

app.post("/api/projects", authenticateToken, async (req, res) => {
  try {
    const result = projectSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid project data",
        errors: result.error.issues,
      });
    }

    const { name, description, deadline } = result.data;
    const userId = req.user.userId;

    const project = await prisma.$transaction(async (tx) => {
      // Create the project
      const newProject = await tx.project.create({
        data: {
          name,
          description,
          deadline: deadline ? new Date(deadline) : null,
          ownerId: userId,
        },
      });

      // Creator automatically becomes OWNER
      await tx.projectMember.create({
        data: {
          projectId: newProject.id,
          userId,
          role: "OWNER",
        },
      });

      return newProject;
    });

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ======================================================
// GET USER'S PROJECTS / WORKSPACES
// ======================================================

app.get("/api/projects", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const memberships = await prisma.projectMember.findMany({
      where: {
        userId,
      },
      include: {
        project: true,
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    const projects = memberships.map((membership) => ({
      ...membership.project,
      role: membership.role,
    }));

    return res.status(200).json({
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});