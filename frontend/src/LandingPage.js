import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="landing-wrapper">
            <header className="landing-header">
                <div className="logo">ABSEEK</div>
                <nav className="landing-nav">
                    <button onClick={() => scrollTo('hero')}>Home</button>
                    <button onClick={() => scrollTo('heatmap')}>Heatmap</button>
                    <button onClick={() => scrollTo('stats')}>Statistics</button>
                    <button onClick={() => scrollTo('news')}>Updates</button>
                    <button onClick={() => scrollTo('contact')}>Contact</button>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/signup')}>Sign Up</button> h
                </nav>
            </header>

            <section id="hero" className="hero">
                <h1>Discover Animal Bite Incidents in Your Area</h1>
                <p>Helping communities prevent rabies through data-driven insights.</p>
                <button className="heatmap-button" onClick={() => scrollTo('heatmap')}>
                    View Heatmap
                </button>
            </section>

            <section id="heatmap" className="destinations">
                <h2>Live Heatmap</h2>
                <p>Visualize hotspots of animal bite cases in Sariaya, Quezon.</p>
                <div className="destinations-grid">
                    <div className="card">[ Embed Heatmap Here ]</div>
                </div>
            </section>



            <section id="stats" className="stories">
                <h2>Statistics</h2>
                <div className="stories-grid">
                    <div className="story-card">[ Chart or Graph 1 ]</div>
                    <div className="story-card">[ Chart or Graph 2 ]</div>
                </div>
            </section>

            <section id="news" className="highlight">
                <h2>Latest Updates</h2>
                <div className="testimonial">
                    [ Latest rabies prevention tips, LGU announcements, or DOH bulletins ]
                </div>
            </section>

            <section id="contact" className="newsletter">
                <h2>Stay Updated</h2>
                <input type="email" placeholder="Enter your email" />
                <button>Subscribe</button>
            </section>

            <footer className="footer">
                &copy; 2025 ABSEEK | Community-Based Rabies Monitoring System
            </footer>
        </div>
    );
};

export default LandingPage;
