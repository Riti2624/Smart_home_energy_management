import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function Landing() {
  return (
    <div className="landing">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-inner">
          <div className="nav-logo">SmartEnergy</div>

          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#faqs">FAQs</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          <ThemeToggle />
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-left">
          <span className="hero-tag">Smart Energy Platform</span>

          <h1>
            Smart Home <br />
            <span>Energy Management</span>
          </h1>

          <p>
            Monitor, analyze, and optimize renewable energy usage
            with real-time AI-powered insights.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <h3>98%</h3>
              <span>Efficiency</span>
            </div>
            <div className="stat">
              <h3>24/7</h3>
              <span>Monitoring</span>
            </div>
            <div className="stat">
              <h3>AI</h3>
              <span>Insights</span>
            </div>
          </div>

          <div className="auth-panel">
            <Link to="/login">
              <button className="auth-btn secondary">Login</button>
            </Link>
            <Link to="/signup">
              <button className="auth-btn">Sign Up</button>
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="mockup" />
        </div>
      </section>

      {/* ABOUT US */}
<section className="section" id="about">
  <h2>About Us</h2>

  <p>
    We are building a smart energy management platform designed to help
    households monitor, analyze, and optimize renewable energy usage.
    Our goal is to make clean energy smarter, more affordable, and
    accessible to everyone.
  </p>

  <div className="about-cards">
    <div className="about-card">
      <h4>🌱 Sustainability First</h4>
      <p>
        We focus on reducing energy waste and maximizing renewable
        energy efficiency for a greener future.
      </p>
    </div>

    <div className="about-card">
      <h4>⚡ Smart Insights</h4>
      <p>
        AI-powered analytics help you understand usage patterns and
        make better energy decisions.
      </p>
    </div>

    <div className="about-card">
      <h4>🔒 Secure & Reliable</h4>
      <p>
        Your data is protected with modern security practices and
        reliable infrastructure.
      </p>
    </div>
  </div>
</section>

     {/* TESTIMONIALS */}
<section className="section" id="testimonials">
  <h2>What Our Users Say</h2>

  <p>
    Trusted by homeowners using renewable energy to make smarter,
    cleaner, and more efficient energy decisions.
  </p>

  <div className="testimonials">
    <div className="testimonial-card">
      <p>
        “This platform completely changed how I track my solar usage.
        The AI insights are insanely helpful.”
      </p>
      <span>— Rahul Mehta, Solar Home Owner</span>
    </div>

    <div className="testimonial-card">
      <p>
        “I can finally see where my energy goes. The real-time monitoring
        is accurate and easy to understand.”
      </p>
      <span>— Sarah Johnson, Smart Home User</span>
    </div>

    <div className="testimonial-card">
      <p>
        “Clean UI, powerful analytics, and great performance.
        Highly recommended for renewable homes.”
      </p>
      <span>— Daniel Wong, Energy Consultant</span>
    </div>
  </div>
</section>

      {/* FAQ */}
<section className="section" id="faqs">
  <h2>Frequently Asked Questions</h2>

  <p>
    Answers to common questions about our smart energy management
    platform.
  </p>

  <div className="faq-list">
    <details className="faq-item">
      <summary>How does the platform track energy usage?</summary>
      <p>
        We use smart meter integrations and AI-powered analytics to
        track and analyze energy consumption in real time.
      </p>
    </details>

    <details className="faq-item">
      <summary>Is my energy data secure?</summary>
      <p>
        Yes. All user data is encrypted and stored securely following
        modern security best practices.
      </p>
    </details>

    <details className="faq-item">
      <summary>Can I use this with solar or wind energy?</summary>
      <p>
        Absolutely. Our platform supports solar, wind, and hybrid
        renewable energy systems.
      </p>
    </details>

    <details className="faq-item">
      <summary>Do I need special hardware?</summary>
      <p>
        No additional hardware is required if you already have a smart
        meter. Otherwise, we’ll guide you through setup options.
      </p>
    </details>
  </div>
</section>
      {/* CONTACT */}
     <section class="section contact-section" id="contact">
  <h2>Contact Us</h2>
  <p>
    Have questions, feedback, or want to work with us?
    We’d love to hear from you.
  </p>

  <div class="contact-wrapper">
    {/* LEFT */}
    <div class="contact-info">
      <h3>Let’s Talk</h3>
      <p>
        Reach out anytime — our team usually responds within 24 hours.
      </p>

      <ul>
        <li>📧 support@smartenergy.ai</li>
        <li>📍 Bengaluru, India</li>
        <li>⏰ Mon – Fri, 9AM – 6PM</li>
      </ul>
    </div>

    {/* RIGHT */}
    <form class="contact-form">
      <input type="text" placeholder="Your Name" required />
      <input type="email" placeholder="Your Email" required />
      <textarea placeholder="Your Message" rows="5" required />
      <button type="submit" class="auth-btn">Send Message</button>
    </form>
  </div>
</section>
    </div>
  );
}