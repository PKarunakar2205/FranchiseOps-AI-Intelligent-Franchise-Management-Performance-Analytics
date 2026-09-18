const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

function parseCSVLine(line) {
  return line.split(',').map(field => field.trim());
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.trim().split('-');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  // Convert DD-MM-YYYY to YYYY-MM-DD for PostgreSQL DATE
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

async function importRetailSales() {
  const csvPath = path.join(__dirname, '../data/Indian Retail Store.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`Error: CSV file not found at ${csvPath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');

  if (lines.length <= 1) {
    console.log('CSV file is empty or only contains headers.');
    process.exit(0);
  }

  const dataLines = lines.slice(1);

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  let totalRows = dataLines.length;
  let insertedRows = 0;
  let skippedRows = 0;
  let failedRows = 0;

  try {
    await client.connect();
    await client.query('BEGIN');

    const insertQuery = `
      INSERT INTO retail_sales (
        bill_id, customer_name, city, product_category,
        quantity, total_amount, payment_method, store_type, visit_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (bill_id) DO NOTHING;
    `;

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      try {
        const fields = parseCSVLine(line);
        if (fields.length < 9) {
          failedRows++;
          continue;
        }

        const billId = parseInt(fields[0], 10);
        const customerName = fields[1] || null;
        const city = fields[2] || null;
        const productCategory = fields[3] || null;
        const quantity = parseInt(fields[4], 10);
        const totalAmount = parseFloat(fields[5]);
        const paymentMethod = fields[6] || null;
        const storeType = fields[7] || null;
        const visitDate = parseDate(fields[8]);

        if (isNaN(billId)) {
          failedRows++;
          continue;
        }

        const res = await client.query(insertQuery, [
          billId,
          customerName,
          city,
          productCategory,
          quantity,
          totalAmount,
          paymentMethod,
          storeType,
          visitDate
        ]);

        if (res.rowCount > 0) {
          insertedRows++;
        } else {
          skippedRows++;
        }
      } catch (rowError) {
        console.error(`Row ${i + 2} processing error:`, rowError.message);
        failedRows++;
      }
    }

    await client.query('COMMIT');

    console.log('\n==================================================');
    console.log('          RETAIL SALES CSV IMPORT SUMMARY         ');
    console.log('==================================================');
    console.log(`  Total CSV Rows Processed : ${totalRows}`);
    console.log(`  Successfully Inserted    : ${insertedRows}`);
    console.log(`  Skipped (Duplicate Bills): ${skippedRows}`);
    console.log(`  Failed Rows              : ${failedRows}`);
    console.log('==================================================\n');

  } catch (dbError) {
    console.error('Fatal import error, rolling back transaction:', dbError.message);
    try {
      await client.query('ROLLBACK');
    } catch (rbError) {
      console.error('Rollback error:', rbError.message);
    }
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  importRetailSales();
}

module.exports = importRetailSales;
