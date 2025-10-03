import { motion } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <FiFileText className="w-10 h-10 text-blue-600 dark:text-emerald-400" />
          <h1 className="text-4xl font-bold">Terms of Service</h1>
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
          <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-700 dark:text-gray-300">
            By accessing and using Footylytics, you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to these terms, please do not 
            use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. Description of Service</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Footylytics provides:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>Live football scores and match updates</li>
            <li>Fixtures, standings, and team information</li>
            <li>AI-powered match predictions (Premium feature)</li>
            <li>Advanced analytics and statistics (Premium feature)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. User Accounts</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            To access certain features, you must create an account. You agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Be responsible for all activities under your account</li>
            <li>Not share your account with others</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. Premium Subscription</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Premium subscriptions are billed on a recurring basis:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>Monthly: ₹29 per month</li>
            <li>Yearly: ₹299 per year</li>
            <li>Subscriptions automatically renew unless cancelled</li>
            <li>You can cancel anytime from your account settings</li>
            <li>Refunds are provided on a case-by-case basis</li>
            <li>Prices are subject to change with 30 days notice</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. Payment Terms</h2>
          <p className="text-gray-700 dark:text-gray-300">
            All payments are processed securely through Stripe. By subscribing to Premium, 
            you authorize us to charge your payment method on a recurring basis. You are 
            responsible for providing accurate payment information and maintaining sufficient 
            funds or credit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Acceptable Use</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            You agree not to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>Use the service for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Scrape, copy, or redistribute our content without permission</li>
            <li>Interfere with or disrupt the service</li>
            <li>Use automated systems to access the service</li>
            <li>Impersonate others or provide false information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Intellectual Property</h2>
          <p className="text-gray-700 dark:text-gray-300">
            All content, features, and functionality of Footylytics are owned by us and are 
            protected by international copyright, trademark, and other intellectual property laws. 
            Match data is provided by third-party services and remains their property.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">8. Disclaimer of Warranties</h2>
          <p className="text-gray-700 dark:text-gray-300">
            The service is provided "as is" without warranties of any kind. We do not guarantee 
            that the service will be uninterrupted, secure, or error-free. AI predictions are 
            for entertainment purposes only and should not be used for betting or gambling.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">9. Limitation of Liability</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We shall not be liable for any indirect, incidental, special, consequential, or 
            punitive damages resulting from your use of or inability to use the service. Our 
            total liability shall not exceed the amount you paid us in the past 12 months.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">10. Termination</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We reserve the right to suspend or terminate your account at any time for violations 
            of these terms. You may terminate your account at any time by contacting us. Upon 
            termination, your right to use the service will immediately cease.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">11. Changes to Terms</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We reserve the right to modify these terms at any time. We will notify users of 
            material changes via email or through the service. Continued use of the service 
            after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">12. Governing Law</h2>
          <p className="text-gray-700 dark:text-gray-300">
            These terms shall be governed by and construed in accordance with the laws of India. 
            Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">13. Contact Information</h2>
          <p className="text-gray-700 dark:text-gray-300">
            For questions about these Terms of Service, please contact us at:
          </p>
          <p className="text-blue-600 dark:text-emerald-400 font-semibold mt-2">
            legal@footylytics.com
          </p>
        </section>
      </motion.div>
    </div>
  );
}
