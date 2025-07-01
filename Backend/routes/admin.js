import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import db from '../database/db.js'; 

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/stats', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let dateFilter = '';
        let params = [];

        if (startDate && endDate) {
            dateFilter = 'WHERE created_at BETWEEN ? AND ?';
            params = [startDate, endDate];
        }

        const newSubscriptions = await db.getAsync(`
      SELECT COUNT(*) as count FROM subscriptions ${dateFilter}
    `, params);

        const monthlyRevenue = await db.getAsync(`
      SELECT COALESCE(SUM(total_price), 0) as total 
      FROM subscriptions 
      WHERE status = 'active'
    `);

        const activeSubscriptions = await db.getAsync(`
      SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'
    `);

        const reactivations = await db.getAsync(`
      SELECT COUNT(*) as count FROM subscriptions 
      WHERE status = 'active' AND paused_from IS NOT NULL
    `);

        res.json({
            success: true,
            stats: {
                newSubscriptions: newSubscriptions.count,
                monthlyRevenue: monthlyRevenue.total,
                activeSubscriptions: activeSubscriptions.count,
                reactivations: reactivations.count
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
            statusFilter = 'WHERE s.status = ?';
            params = [status, limit, offset];
        }

        const subscriptions = await db.allAsync(`
      SELECT 
        s.*,
        u.full_name as user_full_name,
        u.email as user_email
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      ${statusFilter}
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `, params);

        const totalCount = await db.getAsync(`
      SELECT COUNT(*) as count FROM subscriptions s
      ${statusFilter}
    `, status && status !== 'all' ? [status] : []);

        const formattedSubscriptions = subscriptions.map(sub => ({
            ...sub,
            mealTypes: JSON.parse(sub.meal_types),
            deliveryDays: JSON.parse(sub.delivery_days)
        }));

        res.json({
            success: true,
            subscriptions: formattedSubscriptions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount.count / limit),
                totalItems: totalCount.count,
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

        const users = await db.allAsync(`
      SELECT 
        u.id, u.full_name, u.email, u.is_admin, u.created_at,
        COUNT(s.id) as subscription_count
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id
      WHERE u.is_admin = 0
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

        const totalCount = await db.getAsync(`
      SELECT COUNT(*) as count FROM users WHERE is_admin = 0
    `);

        res.json({
            success: true,
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount.count / limit),
                totalItems: totalCount.count,
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
        const testimonials = await db.allAsync(`
      SELECT * FROM testimonials 
      ORDER BY created_at DESC
    `);

        res.json({
            success: true,
            testimonials
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

        await db.runAsync(`
      UPDATE testimonials 
      SET is_approved = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [isApproved ? 1 : 0, id]);

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