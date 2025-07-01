import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../database/db.js';

const router = express.Router();

// Create subscription
router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            name,
            phone,
            planName,
            planPrice,
            mealTypes,
            deliveryDays,
            allergies,
            totalPrice
        } = req.body;

        // Validate required fields
        if (!name || !phone || !planName || !planPrice || !mealTypes || !deliveryDays || !totalPrice) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        const result = await pool.query(
            `INSERT INTO subscriptions 
             (user_id, name, phone, plan_name, plan_price, meal_types, delivery_days, allergies, total_price)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [
                req.user.id,
                name,
                phone,
                planName,
                planPrice,
                JSON.stringify(mealTypes),
                JSON.stringify(deliveryDays),
                allergies || '',
                totalPrice
            ]
        );

        const subscription = {
            ...result.rows[0],
            meal_types: result.rows[0].meal_types,
            delivery_days: result.rows[0].delivery_days
        };

        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            subscription
        });
    } catch (error) {
        console.error('Create subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create subscription'
        });
    }
});

// Get user's subscriptions
router.get('/my-subscriptions', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );

        const subscriptions = result.rows.map(sub => ({
            ...sub,
            mealTypes: sub.meal_types,
            deliveryDays: sub.delivery_days
        }));

        res.json({
            success: true,
            subscriptions
        });
    } catch (error) {
        console.error('Get subscriptions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get subscriptions'
        });
    }
});

// Update subscription status
router.put('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, pausedFrom, pausedTo } = req.body;

        // Verify subscription belongs to user
        const checkResult = await pool.query(
            'SELECT id FROM subscriptions WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }

        let query = 'UPDATE subscriptions SET status = $1, updated_at = CURRENT_TIMESTAMP';
        let params = [status];

        if (status === 'paused' && pausedFrom && pausedTo) {
            query += ', paused_from = $2, paused_to = $3';
            params.push(pausedFrom, pausedTo);
        } else if (status === 'active') {
            query += ', paused_from = NULL, paused_to = NULL';
        }

        query += ' WHERE id = $' + (params.length + 1) + ' RETURNING *';
        params.push(id);

        const result = await pool.query(query, params);

        const subscription = {
            ...result.rows[0],
            mealTypes: result.rows[0].meal_types,
            deliveryDays: result.rows[0].delivery_days
        };

        res.json({
            success: true,
            message: 'Subscription updated successfully',
            subscription
        });
    } catch (error) {
        console.error('Update subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update subscription'
        });
    }
});

export default router;