
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres.abulzysriwkgbggbjigt:soen343_sees@aws-0-us-west-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Database connected! Current time:", res.rows[0]);
  } catch (err) {
    console.error("❌ Database connection error:", err);
  } finally {
    pool.end();
  }
}

testConnection();
