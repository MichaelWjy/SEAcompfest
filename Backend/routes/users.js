import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../database/db.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, full_name, email, is_admin, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { fullName } = req.body;

        if (!fullName) {
            return res.status(400).json({
                success: false,
                message: 'Full name is required'
            });
        }

        const result = await pool.query(
            'UPDATE users SET full_name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, full_name, email, is_admin',
            [fullName, req.user.id]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

export default router;