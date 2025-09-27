import { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    title: 'Real-Time Messaging',
    description: 'Chat instantly with friends and colleagues with zero delay.',
    icon: '💬',
  },
  {
    title: 'Secure & Private',
    description: 'End-to-end encryption ensures your conversations stay private.',
    icon: '🔒',
  },
  {
    title: 'Cross-Platform',
    description: 'Access your chats on web, iOS, or Android seamlessly.',
    icon: '📱',
  },
];

function LandingPage() {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleScroll = (e: Event) => {
      e.preventDefault();
      const target = (e.target as HTMLAnchorElement).getAttribute('href')?.slice(1);
      if (target) {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => link.addEventListener('click', handleScroll));
    return () => links.forEach((link) => link.removeEventListener('click', handleScroll));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ChatApp</h1>
          <div className="space-x-4">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition">
              Features
            </a>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 animate-fade-in">
            Connect Instantly with ChatApp
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Experience seamless, secure, and real-time communication with friends and teams, anywhere,
            anytime.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose ChatApp?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4">&copy; 2025 ChatApp. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#about" className="hover:text-blue-400 transition">
              About
            </a>
            <a href="#contact" className="hover:text-blue-400 transition">
              Contact
            </a>
            <a href="#privacy" className="hover:text-blue-400 transition">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;