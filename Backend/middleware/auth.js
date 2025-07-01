import jwt from 'jsonwebtoken';
import pool from '../database/db.js'; 

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userResult = await pool.query('SELECT id, full_name, email, is_admin FROM users WHERE id = $1', [decoded.userId]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        req.user = userResult.rows[0];
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export const requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};