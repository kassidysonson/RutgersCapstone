import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <p className="about-eyebrow">Our Mission</p>
        <h1 className="about-hero-heading">Making connections better for everyone</h1>
        <p className="about-hero-text">
          We empower the next generation of professionals by creating accessible, experience-driven pathways 
          between education and industry. At JoinUp, we believe that education 
          should not end at the classroom door — it should evolve through connection, collaboration, and creation.
        </p>
      </section>

      <section className="about-section about-section-split about-surface-muted">
        <div className="about-section-content">
          <p className="about-eyebrow">Our People</p>
          <h2 className="about-section-heading">Creating a community of impact</h2>
          <p className="about-section-text">
            JoinUp was created by four students who saw a prominent gap between the classroom and the real world. We realized that
            while students gain knowledge every day, opportunities to apply that knowledge through meaningful collaboration are
            often limited.
          </p>
          <p className="about-section-text">
            With our growing community of students and founders across the globe, we're helping everyone build real-world
            experience. We also thrive on change and seek to have an impact on every opportunity we see.
          </p>
        </div>
        <div className="about-section-image">
          <img src="/assets/getty.jpg" alt="Students collaborating around a table" />
        </div>
      </section>



      <section className="about-section">
        <p className="about-eyebrow">Our Story</p>
        <h2 className="about-section-heading">From classroom to community</h2>
        <p className="about-section-text">
          So, we built JoinUp — a platform designed to connect students with other students, founders, and real-world projects.
          Our mission is simple: to empower students to gain hands-on experience, build strong networks, and grow their
          professional skills — all while collaborating on projects that make an impact.
        </p>
        <p className="about-section-text">
          We believe that every student has something valuable to contribute. Whether you're a designer, developer, writer,
          entrepreneur, or simply eager to learn, JoinUp gives you a space to collaborate with like-minded peers from across
          disciplines, create innovative projects that turn ideas into reality, and connect with founders, startups, and
          opportunities that help you grow.
        </p>
      </section>

      <section className="about-section about-section-split about-section-reverse about-surface-muted">
        <div className="about-section-image">
          <img src="/assets/hero-image.png" alt="Students smiling together" />
        </div>
        <div className="about-section-content">
          <p className="about-eyebrow">Our Vision</p>
          <h2 className="about-section-heading">Building the future, together</h2>
          <p className="about-section-text">
            What started as a student-led initiative has grown into a community where learning meets doing — where every project
            is a chance to build experience, confidence, and future success.
          </p>
          <p className="about-section-text">
            To bridge the gap between students and real-world experience, we're creating a collaborative ecosystem where learning,
            innovation, and opportunity come together.
          </p>
        </div>
      </section>

      <section className="about-section about-commitment">
        <p className="about-eyebrow">We're committed to</p>
        <h2 className="about-section-heading">Helping students succeed</h2>
        <div className="about-pillars">
          <div className="about-pillar">
            <span className="about-pillar-number">1</span>
            <h3>Real-world experience</h3>
            <p>Gain real-world experience while studying, building skills that matter.</p>
          </div>
          <div className="about-pillar">
            <span className="about-pillar-number">2</span>
            <h3>Marketable skills</h3>
            <p>Develop marketable skills through project-based collaboration.</p>
          </div>
          <div className="about-pillar">
            <span className="about-pillar-number">3</span>
            <h3>Lasting connections</h3>
            <p>Build connections that last beyond the classroom.</p>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-cta-content">
          <h2 className="about-cta-heading">Experience shouldn't wait</h2>
          <p className="about-cta-text">
            At JoinUp, we believe experience shouldn't wait until graduation — it should start now.
          </p>
          <Link to="/login" className="about-cta-button">Start Your Journey</Link>
        </div>
      </section>


    </div>
  );
};

export default About;
