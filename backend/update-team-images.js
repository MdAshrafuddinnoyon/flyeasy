const pool = require('./config/db');

async function updateImages() {
  try {
    const [team] = await pool.query('SELECT id FROM team_members ORDER BY sort_order ASC');
    if (team.length >= 3) {
      await pool.query('UPDATE team_members SET image_url = ? WHERE id = ?', ['/images/team_member_3.jpg', team[2].id]);
    }
    console.log("Team member 3 updated");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
updateImages();
