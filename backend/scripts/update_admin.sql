USE ladies_tailor_db;

-- Update admin password to 'admin123'
UPDATE admins SET password_hash = '$2a$10$UidAntRSHHjbYrhplXZ0B.O8cnpFH7O0Z.JYAma3jLPQ7W.Ey9H2m' WHERE username = 'admin';

SELECT 'Admin password updated successfully!' as message;
SELECT username, SUBSTRING(password_hash, 1, 30) as hash_preview FROM admins WHERE username = 'admin';
