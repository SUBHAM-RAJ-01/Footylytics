import { useState } from 'react';
import { FiCheck, FiAward, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: '',
    priceId: null,
    features: [
      'Live scores',
      'Fixtures and standings',
      'Match notifications',
      'Basic team info',
      'Includes ads'
    ]
  },
  {
    name: 'Premium Monthly',
    price: '₹29',
    period: '/month',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY,
    features: [
      'Everything in Free',
      'AI-powered predictions',
      'Advanced analytics & charts',
      'Ad-free experience',
      'Priority notifications',
      'Detailed head-to-head analysis',
      'Unlimited favorite teams'
    ],
    highlighted: true,
    badge: 'Most Popular'
  },
  {
    name: 'Premium Yearly',
    price: '₹299',
    period: '/year',
    savings: 'Save ₹49',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ID_YEARLY,
    features: [
      'Everything in Premium Monthly',
      'Best value - 2 months free',
      'Priority support',
      'Early access to new features'
    ],
    badge: 'Best Value'
  }
];

export default function Pricing() {
  const { user, session, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleUpgrade = async (priceId, planName) => {
    if (!user || !session) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setSelectedPlan(planName);

    try {
      const { data } = await axios.post(
        `https://footylytics.onrender.com/api/payments/create-checkout-session`,
        { priceId },
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const currentPlan = profile?.is_premium ? 'Premium' : 'Free';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Upgrade to Premium for AI predictions and advanced features
        </p>
        {profile && (
          <div className="mt-4 inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full">
            <FiAward className="w-5 h-5" />
            <span className="font-semibold">Current Plan: {currentPlan}</span>
          </div>
        )}
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const isCurrentPlan = 
            (plan.name === 'Free' && !profile?.is_premium) ||
            (plan.name.includes('Premium') && profile?.is_premium);

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white dark:bg-slate-800 rounded-2xl p-8 border-2 transition-all flex flex-col ${
                plan.highlighted
                  ? 'border-blue-600 dark:border-emerald-600 shadow-2xl scale-105'
                  : 'border-gray-200 dark:border-slate-700 shadow-lg'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <FiZap className="w-4 h-4" />
                    <span>{plan.badge}</span>
                  </div>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute top-4 right-4">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                    Current Plan
                  </div>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-gray-600 dark:text-gray-400 text-lg">{plan.period}</span>
                )}
                {plan.savings && (
                  <div className="mt-2">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                      {plan.savings}
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start space-x-3">
                    <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button - Always at bottom */}
              {profile?.is_premium && plan.priceId ? (
                // Premium user - show active status
                <div className="w-full py-4 text-center font-medium bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-700 dark:text-yellow-400 rounded-xl border-2 border-yellow-400/50">
                  <div className="flex items-center justify-center space-x-2">
                    <FiAward className="w-5 h-5" />
                    <span>Active Premium</span>
                  </div>
                </div>
              ) : !isCurrentPlan && plan.priceId ? (
                // Free user - show upgrade button
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUpgrade(plan.priceId, plan.name)}
                  disabled={loading && selectedPlan === plan.name}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-xl'
                      : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading && selectedPlan === plan.name ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    'Upgrade Now'
                  )}
                </motion.button>
              ) : (
                <div className="w-full py-4 text-center text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-slate-700 rounded-xl">
                  {isCurrentPlan ? 'Your current plan' : 'Free Plan'}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* FAQ or Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8"
      >
        <h3 className="text-xl font-bold mb-4">Why Upgrade to Premium?</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-blue-600 dark:text-emerald-400 font-semibold mb-2">🤖 AI Predictions</div>
            <p className="text-gray-600 dark:text-gray-400">
              Get match predictions powered by Google Gemini AI with confidence scores
            </p>
          </div>
          <div>
            <div className="text-blue-600 dark:text-emerald-400 font-semibold mb-2">📊 Advanced Analytics</div>
            <p className="text-gray-600 dark:text-gray-400">
              Access detailed statistics, charts, and head-to-head analysis
            </p>
          </div>
          <div>
            <div className="text-blue-600 dark:text-emerald-400 font-semibold mb-2">🚫 Ad-Free</div>
            <p className="text-gray-600 dark:text-gray-400">
              Enjoy a clean, distraction-free experience without any advertisements
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
