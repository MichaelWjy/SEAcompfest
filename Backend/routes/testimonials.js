import express from 'express';
import pool from '../database/db.js';

const router = express.Router();

// Get all approved testimonials
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM testimonials WHERE is_approved = true ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            testimonials: result.rows
        });
    } catch (error) {
        console.error('Get testimonials error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get testimonials'
        });
    }
});

// Create testimonial
router.post('/', async (req, res) => {
    try {
        const { customerName, message, rating } = req.body;

        if (!customerName || !message || !rating) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const result = await pool.query(
            'INSERT INTO testimonials (customer_name, message, rating) VALUES ($1, $2, $3) RETURNING *',
            [customerName, message, rating]
        );

        res.status(201).json({
            success: true,
            message: 'Testimonial created successfully',
            testimonial: result.rows[0]
        });
    } catch (error) {
        console.error('Create testimonial error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create testimonial'
        });
    }
});

export default router;