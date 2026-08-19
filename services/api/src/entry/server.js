require("dotenv").config();

const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { z } = require("zod");


const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});
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

// Add-member validation
const addMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Task creation validation
const taskCreateSchema = z.object({
  title: z.string().min(2, "Task title must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.string().datetime().optional(),
  assigneeId: z.number().int().positive().optional(),
});

// Task update validation (all fields optional — PATCH is a partial update)
const taskUpdateSchema = z.object({
  title: z.string().min(2, "Task title must be at least 2 characters").optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  // assigneeId can be a positive int (assign) or explicit null (unassign)
  assigneeId: z.number().int().positive().nullable().optional(),
});

// Manual activity creation validation
const activityCreateSchema = z.object({
  title: z.string().min(2, "Activity title must be at least 2 characters"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["RESEARCH", "DOCUMENTATION", "TESTING", "DESIGN", "MEETING"]),
  evidenceUrl: z.string().url("Invalid evidence URL").optional(),
  activityDate: z.string().datetime(),
});

// Manual activity update validation (all fields optional — PATCH is a partial update)
const activityUpdateSchema = z.object({
  title: z.string().min(2, "Activity title must be at least 2 characters").optional(),
  description: z.string().min(1, "Description is required").optional(),
  type: z.enum(["RESEARCH", "DOCUMENTATION", "TESTING", "DESIGN", "MEETING"]).optional(),
  evidenceUrl: z.string().url("Invalid evidence URL").optional(),
  activityDate: z.string().datetime().optional(),
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
// GET PROJECT MEMBERS
// ======================================================

app.get("/api/projects/:id/members", authenticateToken, async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId)) {
      return res.status(400).json({
        message: "Invalid project id",
      });
    }

    // Requester must belong to this project to see its members
    const requesterMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: req.user.userId,
        },
      },
    });

    if (!requesterMembership) {
      return res.status(403).json({
        message: "You do not have access to this workspace",
      });
    }

    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    return res.status(200).json({
      members: members.map((member) => ({
        id: member.id,
        role: member.role,
        joinedAt: member.joinedAt,
        user: member.user,
      })),
    });
  } catch (error) {
    console.error("Get members error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ======================================================
// ADD PROJECT MEMBER
// ======================================================

app.post("/api/projects/:id/members", authenticateToken, async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId)) {
      return res.status(400).json({
        message: "Invalid project id",
      });
    }

    const result = addMemberSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid member data",
        errors: result.error.issues,
      });
    }

    const { email } = result.data;

    // Only an existing member can even attempt this, and only an OWNER
    // is allowed to add someone else.
    const requesterMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: req.user.userId,
        },
      },
    });

    if (!requesterMembership) {
      return res.status(403).json({
        message: "You do not have access to this workspace",
      });
    }

    if (requesterMembership.role !== "OWNER") {
      return res.status(403).json({
        message: "Only the workspace owner can add members",
      });
    }

    // The person being added must already have a FootPrint account —
    // there is no separate invitation flow in this version.
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      return res.status(404).json({
        message: "No FootPrint account found with that email. They need to register first.",
      });
    }

    const existingMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: invitedUser.id,
        },
      },
    });

    if (existingMembership) {
      return res.status(409).json({
        message: "This person is already a member of the workspace",
      });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: invitedUser.id,
        role: "MEMBER",
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(201).json({
      message: "Member added successfully",
      member: {
        id: member.id,
        role: member.role,
        joinedAt: member.joinedAt,
        user: member.user,
      },
    });
  } catch (error) {
    console.error("Add member error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ======================================================
// SHARED TASK HELPERS
// ======================================================

// Fields we're comfortable sending to the client for an assignee/creator —
// keeps password hashes and other internal fields out of task responses.
const taskMemberSelect = {
  id: true,
  role: true,
  user: {
    select: { id: true, name: true, email: true },
  },
};

function serializeTask(task) {
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    completedAt: task.completedAt,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    assignee: task.assignee,
    createdBy: task.createdBy,
  };
}

// ======================================================
// CREATE TASK
// ======================================================

app.post("/api/projects/:id/tasks", authenticateToken, async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId)) {
      return res.status(400).json({
        message: "Invalid project id",
      });
    }

    const result = taskCreateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid task data",
        errors: result.error.issues,
      });
    }

    const { title, description, status, priority, dueDate, assigneeId } = result.data;

    // Requester must belong to this project. Their ProjectMember row also
    // becomes the task's createdById — we never trust a client-supplied
    // creator, since that would let anyone credit a task to someone else.
    const requesterMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: req.user.userId,
        },
      },
    });

    if (!requesterMembership) {
      return res.status(403).json({
        message: "You do not have access to this workspace",
      });
    }

    // If an assignee was supplied, it must be a ProjectMember of the SAME
    // project — otherwise a task could end up attributed to someone
    // outside this workspace entirely.
    if (assigneeId !== undefined) {
      const assigneeMembership = await prisma.projectMember.findUnique({
        where: { id: assigneeId },
      });

      if (!assigneeMembership || assigneeMembership.projectId !== projectId) {
        return res.status(400).json({
          message: "Assignee must be a member of this project",
        });
      }
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        status: status ?? undefined,
        priority: priority ?? undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeId: assigneeId ?? undefined,
        createdById: requesterMembership.id,
      },
      include: {
        assignee: { select: taskMemberSelect },
        createdBy: { select: taskMemberSelect },
      },
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: serializeTask(task),
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ======================================================
// GET PROJECT TASKS
// ======================================================

app.get("/api/projects/:id/tasks", authenticateToken, async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId)) {
      return res.status(400).json({
        message: "Invalid project id",
      });
    }

    const requesterMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: req.user.userId,
        },
      },
    });

    if (!requesterMembership) {
      return res.status(403).json({
        message: "You do not have access to this workspace",
      });
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: { select: taskMemberSelect },
        createdBy: { select: taskMemberSelect },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      tasks: tasks.map(serializeTask),
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ======================================================
// UPDATE TASK
// ======================================================

app.patch("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId)) {
      return res.status(400).json({
        message: "Invalid task id",
      });
    }

    const result = taskUpdateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid task data",
        errors: result.error.issues,
      });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Requester must belong to the project that owns this task — tasks are
    // scoped through their project, same as members and the timeline will be.
    const requesterMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: existingTask.projectId,
          userId: req.user.userId,
        },
      },
    });

    if (!requesterMembership) {
      return res.status(403).json({
        message: "You do not have access to this workspace",
      });
    }

    const { title, description, status, priority, dueDate, assigneeId } = result.data;

    const data = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (priority !== undefined) data.priority = priority;

    if (dueDate !== undefined) {
      data.dueDate = dueDate === null ? null : new Date(dueDate);
    }

    // assigneeId: explicit null unassigns; a number must belong to the
    // SAME project as the task; omitted means "leave unchanged".
    if (assigneeId !== undefined) {
      if (assigneeId === null) {
        data.assigneeId = null;
      } else {
        const assigneeMembership = await prisma.projectMember.findUnique({
          where: { id: assigneeId },
        });

        if (!assigneeMembership || assigneeMembership.projectId !== existingTask.projectId) {
          return res.status(400).json({
            message: "Assignee must be a member of this project",
          });
        }

        data.assigneeId = assigneeId;
      }
    }

    // completedAt is derived from the status transition, never accepted
    // directly from the client — this keeps it as trustworthy evidence.
    if (status !== undefined) {
      data.status = status;

      if (status === "COMPLETED" && existingTask.status !== "COMPLETED") {
        data.completedAt = new Date();
      } else if (status !== "COMPLETED" && existingTask.status === "COMPLETED") {
        data.completedAt = null;
      }
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data,
      include: {
        assignee: { select: taskMemberSelect },
        createdBy: { select: taskMemberSelect },
      },
    });

    return res.status(200).json({
      message: "Task updated successfully",
      task: serializeTask(task),
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ======================================================
// SHARED MANUAL ACTIVITY HELPERS
// ======================================================

function serializeActivity(activity) {
  return {
    id: activity.id,
    projectId: activity.projectId,
    memberId: activity.memberId,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    evidenceUrl: activity.evidenceUrl,
    activityDate: activity.activityDate,
    createdAt: activity.createdAt,
    updatedAt: activity.updatedAt,
    member: activity.member,
  };
}

// ======================================================
// CREATE MANUAL ACTIVITY
// ======================================================

app.post("/api/projects/:id/activities", authenticateToken, async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId)) {
      return res.status(400).json({
        message: "Invalid project id",
      });
    }

    const result = activityCreateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid activity data",
        errors: result.error.issues,
      });
    }

    const { title, description, type, evidenceUrl, activityDate } = result.data;

    // Requester must belong to this project. Their ProjectMember row is the
    // ONLY source for memberId — a client-supplied memberId would let anyone
    // log evidence on behalf of a teammate, which defeats the point of the
    // activity log as trustworthy evidence.
    const requesterMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: req.user.userId,
        },
      },
    });

    if (!requesterMembership) {
      return res.status(403).json({
        message: "You do not have access to this workspace",
      });
    }

    const activity = await prisma.manualActivity.create({
      data: {
        projectId,
        memberId: requesterMembership.id,
        title,
        description,
        type,
        evidenceUrl: evidenceUrl ?? undefined,
        activityDate: new Date(activityDate),
      },
      include: {
        member: { select: taskMemberSelect },
      },
    });

    return res.status(201).json({
      message: "Activity logged successfully",
      activity: serializeActivity(activity),
    });
  } catch (error) {
    console.error("Create activity error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ======================================================
// GET PROJECT ACTIVITIES
// ======================================================

app.get("/api/projects/:id/activities", authenticateToken, async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId)) {
      return res.status(400).json({
        message: "Invalid project id",
      });
    }

    const requesterMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: req.user.userId,
        },
      },
    });

    if (!requesterMembership) {
      return res.status(403).json({
        message: "You do not have access to this workspace",
      });
    }

    const activities = await prisma.manualActivity.findMany({
      where: { projectId },
      include: {
        member: { select: taskMemberSelect },
      },
      orderBy: { activityDate: "desc" },
    });

    return res.status(200).json({
      activities: activities.map(serializeActivity),
    });
  } catch (error) {
    console.error("Get activities error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ======================================================
// UPDATE MANUAL ACTIVITY
// ======================================================

app.patch("/api/activities/:id", authenticateToken, async (req, res) => {
  try {
    const activityId = Number(req.params.id);

    if (!Number.isInteger(activityId)) {
      return res.status(400).json({
        message: "Invalid activity id",
      });
    }

    const result = activityUpdateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid activity data",
        errors: result.error.issues,
      });
    }

    const existingActivity = await prisma.manualActivity.findUnique({
      where: { id: activityId },
    });

    if (!existingActivity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    // Requester must belong to the project that owns this activity.
    const requesterMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: existingActivity.projectId,
          userId: req.user.userId,
        },
      },
    });

    if (!requesterMembership) {
      return res.status(403).json({
        message: "You do not have access to this workspace",
      });
    }

    const { title, description, type, evidenceUrl, activityDate } = result.data;

    // Only these fields are ever accepted. projectId and memberId are never
    // read from the request body, so ownership can't be reassigned via PATCH.
    const data = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (type !== undefined) data.type = type;
    if (evidenceUrl !== undefined) data.evidenceUrl = evidenceUrl;
    if (activityDate !== undefined) data.activityDate = new Date(activityDate);

    const activity = await prisma.manualActivity.update({
      where: { id: activityId },
      data,
      include: {
        member: { select: taskMemberSelect },
      },
    });

    return res.status(200).json({
      message: "Activity updated successfully",
      activity: serializeActivity(activity),
    });
  } catch (error) {
    console.error("Update activity error:", error);

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