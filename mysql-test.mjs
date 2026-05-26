import mysql from "mysql2/promise";

async function main() {
  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "user",
    password: "StrongUserPassword2026!",
    database: "terrific_travel"
  });

  try {
    const [columns] = await connection.query("SHOW COLUMNS FROM VisaService");
    console.log("Columns in VisaService:");
    console.log(columns.map(c => c.Field));

    console.log("Adding column slug...");
    await connection.query("ALTER TABLE VisaService ADD COLUMN slug VARCHAR(191) UNIQUE").catch(e => console.log("Add failed:", e.message));

    const [columnsAfter] = await connection.query("SHOW COLUMNS FROM VisaService");
    console.log("Columns after add:");
    console.log(columnsAfter.map(c => c.Field));

    const [rows] = await connection.query("SELECT slug FROM VisaService LIMIT 1");
    console.log("Select success! First row:", rows[0]);

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
