# Admin Credentials

## Default Admin Account

**Username:** `admin`  
**Password:** `admin123`

## Admin Login URL

Access the admin panel at: `http://localhost:5173/admin/login`

## Important Notes

1. **Change the default password immediately** after first login for security
2. The admin panel allows you to:
   - View and manage all orders
   - Update order status
   - View customer information
   - Manage products (if implemented)
   - View sales analytics

## Creating Additional Admin Accounts

To create a new admin account:

1. Hash your password using the provided script:
   ```bash
   cd backend/scripts
   node hashPassword.js your_new_password
   ```

2. Insert the new admin into the database:
   ```sql
   INSERT INTO admins (username, password_hash) 
   VALUES ('newadmin', 'paste_hash_here');
   ```

## Security Recommendations

- Change default credentials immediately
- Use strong passwords (minimum 12 characters)
- Enable two-factor authentication if available
- Regularly review admin access logs
- Limit admin accounts to trusted personnel only
