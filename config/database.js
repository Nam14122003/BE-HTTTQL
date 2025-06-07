const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Đọc chứng chỉ từ file
const caCertPath = path.join(__dirname, 'ssl_certification.pem'); // Đường dẫn tới file .pem trong thư mục config
const caCert = fs.readFileSync(caCertPath);

// Cấu hình kết nối với TiDB sử dụng SSL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'gateway01ap-southeast-1.prod.aws.tidbcloud.com',
    user: process.env.DB_USER || '3dvvtnDnkUgFuLk.root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'shoe_inventory',
    port: process.env.DB_PORT || 4000,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        ca: caCert // Sử dụng chứng chỉ đã đọc từ file
    }
});

// Kiểm tra kết nối database
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Kết nối database thành công!');
        connection.release();
        return true;
    } catch (error) {
        console.error('Không thể kết nối đến database:', error);
        return false;
    }
};

module.exports = {
    pool,
    testConnection
};
