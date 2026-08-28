const mysql = require('./backend/node_modules/mysql2/promise');
const fs = require('fs');

async function dumpDatabase() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'flyeasy'
  });

  const [tables] = await pool.query('SHOW TABLES');
  const tableNames = tables.map(t => Object.values(t)[0]);

  let sql = 'SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\nSET time_zone = "+00:00";\n\n';

  for (const tableName of tableNames) {
    const [createTableResult] = await pool.query(`SHOW CREATE TABLE \`${tableName}\``);
    const createTableSql = createTableResult[0]['Create Table'];
    sql += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
    sql += `${createTableSql};\n\n`;

    const [rows] = await pool.query(`SELECT * FROM \`${tableName}\``);
    if (rows.length > 0) {
      const keys = Object.keys(rows[0]);
      
      const chunk = 50;
      for (let i = 0; i < rows.length; i += chunk) {
        const rowsChunk = rows.slice(i, i + chunk);
        const values = rowsChunk.map(row => {
          return '(' + keys.map(k => {
            if (row[k] === null) return 'NULL';
            if (typeof row[k] === 'string') return pool.escape(row[k]);
            if (typeof row[k] === 'object' && row[k] instanceof Date) return pool.escape(row[k].toISOString().slice(0, 19).replace('T', ' '));
            if (typeof row[k] === 'object') return pool.escape(JSON.stringify(row[k]));
            return row[k];
          }).join(', ') + ')';
        }).join(',\n');
        
        sql += `INSERT INTO \`${tableName}\` (\`${keys.join('`, `')}\`) VALUES \n${values};\n`;
      }
      sql += '\n';
    }
  }

  fs.writeFileSync('flyeasy_full_dump.sql', sql);
  console.log('Successfully created flyeasy_full_dump.sql');
  process.exit(0);
}

dumpDatabase().catch(err => {
  console.error(err);
  process.exit(1);
});
