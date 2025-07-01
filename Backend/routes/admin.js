import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import pool from '../database/db.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/stats', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let dateFilter = '';
        let params = [];

        if (startDate && endDate) {
            dateFilter = 'WHERE created_at BETWEEN $1 AND $2';
            params = [startDate, endDate];
        }

        const newSubscriptions = await pool.query(`
      SELECT COUNT(*) as count FROM subscriptions ${dateFilter}
    `, params);

        const monthlyRevenue = await pool.query(`
      SELECT COALESCE(SUM(total_price), 0) as total 
      FROM subscriptions 
      WHERE status = 'active'
    `);

        const activeSubscriptions = await pool.query(`
      SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'
    `);

        const reactivations = await pool.query(`
      SELECT COUNT(*) as count FROM subscriptions 
      WHERE status = 'active' AND paused_from IS NOT NULL
    `);

        res.json({
            success: true,
            stats: {
                newSubscriptions: parseInt(newSubscriptions.rows[0].count),
                monthlyRevenue: parseInt(monthlyRevenue.rows[0].total),
                activeSubscriptions: parseInt(activeSubscriptions.rows[0].count),
                reactivations: parseInt(reactivations.rows[0].count)
            }
        });
    } catch (error) {
        console.error('Get admin stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics'
        });
    }
});

router.get('/subscriptions', async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        let statusFilter = '';
        let params = [limit, offset];

        if (status && status !== 'all') {
            statusFilter = 'WHERE s.status = $3';
            params.push(status);
        }

        const subscriptions = await pool.query(`
      SELECT 
        s.*,
        u.full_name as user_full_name,
        u.email as user_email
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      ${statusFilter}
      ORDER BY s.created_at DESC
      LIMIT $1 OFFSET $2
    `, params);

        const countParams = status && status !== 'all' ? [status] : [];
        const totalCount = await pool.query(`
      SELECT COUNT(*) as count FROM subscriptions s
      ${status && status !== 'all' ? 'WHERE s.status = $1' : ''}
    `, countParams);

        const formattedSubscriptions = subscriptions.rows.map(sub => ({
            ...sub,
            mealTypes: sub.meal_types,
            deliveryDays: sub.delivery_days
        }));

        res.json({
            success: true,
            subscriptions: formattedSubscriptions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount.rows[0].count / limit),
                totalItems: parseInt(totalCount.rows[0].count),
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get admin subscriptions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get subscriptions'
        });
    }
});

router.get('/users', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const users = await pool.query(`
      SELECT 
        u.id, u.full_name, u.email, u.is_admin, u.created_at,
        COUNT(s.id) as subscription_count
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id
      WHERE u.is_admin = false
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

        const totalCount = await pool.query(`
      SELECT COUNT(*) as count FROM users WHERE is_admin = false
    `);

        res.json({
            success: true,
            users: users.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount.rows[0].count / limit),
                totalItems: parseInt(totalCount.rows[0].count),
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get admin users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get users'
        });
    }
});

router.get('/testimonials', async (req, res) => {
    try {
        const testimonials = await pool.query(`
      SELECT * FROM testimonials 
      ORDER BY created_at DESC
    `);

        res.json({
            success: true,
            testimonials: testimonials.rows
        });
    } catch (error) {
        console.error('Get admin testimonials error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get testimonials'
        });
    }
});

router.put('/testimonials/:id/approval', async (req, res) => {
    try {
        const { id } = req.params;
        const { isApproved } = req.body;

        await pool.query(`
      UPDATE testimonials 
      SET is_approved = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [isApproved, id]);

        res.json({
            success: true,
            message: 'Testimonial approval status updated'
        });
    } catch (error) {
        console.error('Update testimonial approval error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update testimonial'
        });
    }
});

export default router;