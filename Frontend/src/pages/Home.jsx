import React from 'react';
import Main from '../components/Main';
import Features from '../components/Features';
import TestimonialsSection from '../components/Testimoni';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div>
            <Main />
            <Features />
            <TestimonialsSection />
            <Contact />
            <Footer />
        </div>
    );
};

export default Home;