import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); 

const { Pool } = pg;

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, 
    },
});

export const initializeDatabase = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS meal_plans (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        description TEXT,
        features JSONB,
        image_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        plan_name TEXT NOT NULL,
        plan_price INTEGER NOT NULL,
        meal_types TEXT NOT NULL,
        delivery_days TEXT NOT NULL,
        allergies TEXT,
        total_price INTEGER NOT NULL,
        status TEXT DEFAULT 'active',
        paused_from DATE,
        paused_to DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id UUID PRIMARY KEY,
        customer_name TEXT NOT NULL,
        message TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        is_approved BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        const mealPlansResult = await pool.query('SELECT COUNT(*) FROM meal_plans');
        const mealPlansCount = parseInt(mealPlansResult.rows[0].count);

        if (mealPlansCount === 0) {
            const { v4: uuidv4 } = await import('uuid');

            const defaultMealPlans = [
                {
                    id: uuidv4(),
                    name: 'Diet Plan',
                    price: 30000,
                    description: 'Perfect for weight management and healthy living',
                    features: [
                        'Low-calorie balanced meals',
                        'Fresh vegetables and lean proteins',
                        'Portion-controlled servings',
                        'Nutritionist-approved recipes',
                    ],
                    image_url:
                        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
                },
                {
                    id: uuidv4(),
                    name: 'Protein Plan',
                    price: 40000,
                    description: 'High-protein meals for active lifestyles and muscle building',
                    features: [
                        'High-quality protein sources',
                        'Post-workout recovery meals',
                        'Muscle-building nutrients',
                        'Energy-boosting ingredients',
                    ],
                    image_url:
                        'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800',
                },
                {
                    id: uuidv4(),
                    name: 'Royal Plan',
                    price: 60000,
                    description: 'Premium gourmet meals with the finest ingredients',
                    features: [
                        'Gourmet chef-prepared meals',
                        'Premium organic ingredients',
                        'Exotic and international cuisines',
                        'Luxury dining experience at home',
                    ],
                    image_url:
                        'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
                },
            ];

            for (const plan of defaultMealPlans) {
                await pool.query(
                    `
            INSERT INTO meal_plans (id, name, price, description, features, image_url)
            VALUES ($1, $2, $3, $4, $5, $6)
          `,
                    [
                        plan.id,
                        plan.name,
                        plan.price,
                        plan.description,
                        JSON.stringify(plan.features),
                        plan.image_url,
                    ]
                );
            }
        }

        const testimonialsResult = await pool.query('SELECT COUNT(*) FROM testimonials');
        const testimonialsCount = parseInt(testimonialsResult.rows[0].count);

        if (testimonialsCount === 0) {
            const { v4: uuidv4 } = await import('uuid');

            const defaultTestimonials = [
                {
                    id: uuidv4(),
                    customer_name: 'Sarah Johnson',
                    message:
                        'SEA Catering has transformed my eating habits! The meals are delicious and perfectly portioned.',
                    rating: 5,
                },
                {
                    id: uuidv4(),
                    customer_name: 'Ahmad Rahman',
                    message: 'Great service and amazing food quality. Delivery is always on time!',
                    rating: 5,
                },
                {
                    id: uuidv4(),
                    customer_name: 'Maria Santos',
                    message: 'The Royal Plan is absolutely worth it. Every meal feels like fine dining.',
                    rating: 4,
                },
            ];

            for (const testimonial of defaultTestimonials) {
                await pool.query(
                    `
            INSERT INTO testimonials (id, customer_name, message, rating)
            VALUES ($1, $2, $3, $4)
          `,
                    [
                        testimonial.id,
                        testimonial.customer_name,
                        testimonial.message,
                        testimonial.rating,
                    ]
                );
            }
        }

        console.log('✅ PostgreSQL database initialized successfully');
    } catch (error) {
        console.error('❌ PostgreSQL initialization failed:', error);
        throw error;
    }
};

export default db;
