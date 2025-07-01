import jwt from 'jsonwebtoken';
import db from '../database/db.js'; 

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
        const user = await db.getAsync('SELECT id, full_name, email, is_admin FROM users WHERE id = ?', [decoded.userId]);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        req.user = user;
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