const pool = require('./backend/config/db');
async function run() {
  try {
    const [reviews] = await pool.query(`SELECT item_id, item_type FROM reviews GROUP BY item_id, item_type`);
    for (const r of reviews) {
      const table = r.item_type === 'package' ? 'packages' : r.item_type === 'hotel' ? 'hotels' : null;
      if (!table) continue;
      const [stats] = await pool.query(
        `SELECT COUNT(*) as count, AVG(rating) as avgRating FROM reviews WHERE item_id = ? AND item_type = ? AND status = 'approved'`,
        [r.item_id, r.item_type]
      );
      await pool.query(`UPDATE \`${table}\` SET reviews_count = ?, rating = ? WHERE id = ?`, [stats[0].count || 0, stats[0].avgRating || 0, r.item_id]);
    }
    console.log('All ratings updated');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
