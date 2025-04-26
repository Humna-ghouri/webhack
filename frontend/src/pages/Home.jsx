import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center px-4">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 font-serif">
          <span className="text-blue-600">Qarze Hasana</span> Microfinance
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
          Interest-free loans for empowerment, brought to you by Saylani Welfare Trust
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl">
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: '📋',
              title: 'Easy Application',
              desc: 'Simple 3-step process to request Qarze Hasana'
            },
            {
              icon: '⏱️',
              title: 'Quick Approval',
              desc: 'Get decisions within 72 hours'
            },
            {
              icon: '💰',
              title: 'Zero Interest',
              desc: 'True to Islamic finance principles'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Ready to Begin Your Journey?</h2>
          <p className="text-gray-600 mb-6">Join thousands who have benefited from our Qarze Hasana program</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              Register Now
            </Link>
            <Link
              to="/signin"
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all"
            >
              Existing User? Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>In partnership with Saylani Welfare International Trust</p>
        <p className="mt-2">© {new Date().getFullYear()} Qarze Hasana Microfinance. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;