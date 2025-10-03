import { motion } from 'framer-motion';
import { FiShield } from 'react-icons/fi';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <FiShield className="w-10 h-10 text-blue-600 dark:text-emerald-400" />
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-gray-200 dark:border-slate-700 space-y-6"
      >
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Information We Collect</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>Email address for account creation and authentication</li>
            <li>Payment information processed securely through Stripe</li>
            <li>Usage data and preferences to improve your experience</li>
            <li>Device and browser information for security purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process your transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Personalize your experience with relevant content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. Data Security</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We implement appropriate security measures to protect your personal information. 
            Your payment information is processed securely through Stripe and we never store 
            your credit card details on our servers. All data transmission is encrypted using SSL/TLS.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. Third-Party Services</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            We use the following third-party services:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li><strong>Supabase:</strong> For authentication and database services</li>
            <li><strong>Stripe:</strong> For secure payment processing</li>
            <li><strong>Football-Data.org:</strong> For football match data</li>
            <li><strong>Google Gemini:</strong> For AI-powered predictions (Premium users)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. Cookies and Tracking</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We use cookies and similar tracking technologies to track activity on our service 
            and hold certain information. You can instruct your browser to refuse all cookies 
            or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Your Rights</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>Access and receive a copy of your personal data</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Data Retention</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We retain your personal information only for as long as necessary to provide you 
            with our services and as described in this Privacy Policy. We will also retain 
            and use your information to comply with our legal obligations and resolve disputes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">8. Children's Privacy</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Our service is not intended for children under 13 years of age. We do not knowingly 
            collect personal information from children under 13. If you are a parent or guardian 
            and believe your child has provided us with personal information, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">9. Changes to This Policy</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may update our Privacy Policy from time to time. We will notify you of any 
            changes by posting the new Privacy Policy on this page and updating the "Last updated" 
            date at the top of this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">10. Contact Us</h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-blue-600 dark:text-emerald-400 font-semibold mt-2">
            privacy@footylytics.com
          </p>
        </section>
      </motion.div>
    </div>
  );
}
