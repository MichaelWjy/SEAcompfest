import express from 'express';
import pool from '../database/db.js';

const router = express.Router();

// Get all meal plans
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM meal_plans WHERE is_active = true ORDER BY price ASC'
        );

        const mealPlans = result.rows.map(plan => ({
            ...plan,
            features: plan.features || []
        }));

        res.json({
            success: true,
            mealPlans
        });
    } catch (error) {
        console.error('Get meal plans error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get meal plans'
        });
    }
});

// Get meal plan by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM meal_plans WHERE id = $1 AND is_active = true',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Meal plan not found'
            });
        }

        const mealPlan = {
            ...result.rows[0],
            features: result.rows[0].features || []
        };

        res.json({
            success: true,
            mealPlan
        });
    } catch (error) {
        console.error('Get meal plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get meal plan'
        });
    }
});

export default router;