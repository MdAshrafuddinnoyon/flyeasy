const pool = require('./config/db');

async function createEmailTemplatesTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS email_templates (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        body_html TEXT NOT NULL,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);

    const { v4: uuidv4 } = require('uuid');

    // Seed default template
    const defaultTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <!-- Replace with actual logo URL -->
          <img src="https://via.placeholder.com/150x50?text=FlyEasy" alt="FlyEasy Logo" style="max-width: 150px;" />
        </div>
        <h2 style="color: #0f172a; text-align: center;">Booking Update: [Status]</h2>
        <p style="color: #334155; font-size: 16px;">Dear [Customer Name],</p>
        <p style="color: #334155; font-size: 16px;">Your booking <strong>[Booking ID]</strong> has been updated to: <strong style="color: #3b82f6;">[Status]</strong>.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #0f172a;">Booking Details</h3>
          <p style="margin: 5px 0; color: #475569;"><strong>Package:</strong> [Package Name]</p>
          <p style="margin: 5px 0; color: #475569;"><strong>Date:</strong> [Travel Date]</p>
        </div>

        <p style="color: #334155; font-size: 16px;">If you have any questions, feel free to contact our support team.</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="margin-bottom: 10px; color: #64748b; font-size: 14px;">Need help? WhatsApp us at: <strong>+880 1234 567 890</strong></p>
          <div style="margin-top: 15px;">
            <a href="#" style="text-decoration: none; margin: 0 10px; color: #3b82f6;">Facebook</a>
            <a href="#" style="text-decoration: none; margin: 0 10px; color: #3b82f6;">Instagram</a>
            <a href="#" style="text-decoration: none; margin: 0 10px; color: #3b82f6;">Twitter</a>
          </div>
        </div>
      </div>
    `;

    const [existing] = await pool.query('SELECT * FROM email_templates WHERE name = "Booking Status Update"');
    if (existing.length === 0) {
      await pool.query(
        'INSERT INTO email_templates (id, name, subject, body_html, active) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), 'Booking Status Update', 'Your booking status is now [Status]', defaultTemplate, true]
      );
      console.log('Inserted default email template');
    }

    console.log('email_templates table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating table:', error);
    process.exit(1);
  }
}

createEmailTemplatesTable();
