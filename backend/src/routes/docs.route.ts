// src/routes/docs.ts
import { Router } from "express";
import path from "path";
import express from "express";

const router = Router();

router.get("/redoc", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>📘 Profile API Docs</title>
        <style>body { margin: 0; }</style>
        <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
      </head>
      <body>
        <redoc spec-url="/openapi.yaml"></redoc>
      </body>
    </html>
  `);
});

export default router;
