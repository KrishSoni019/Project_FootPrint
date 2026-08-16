import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:"postgresql://postgres:Krish%40123@localhost:5432/project_footprint"
  },
});
