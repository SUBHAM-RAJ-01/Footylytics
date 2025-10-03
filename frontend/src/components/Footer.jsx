import { Link } from 'react-router-dom';
import { FiMail, FiGithub, FiTwitter, FiLinkedin, FiHeart } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 mt-auto lg:ml-64">
      {/* Mobile: Compact with Socials */}
      <div className="md:hidden px-4 py-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <img src="/flogo.svg" alt="Footylytics" className="h-6 w-6" />
            <span className="text-lg font-bold">Footylytics</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            AI-powered football predictions
          </p>
          
          {/* Social Icons */}
          <div className="flex justify-center space-x-4">
            <a href="#" className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">
              <FiTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">
              <FiGithub className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">
              <FiLinkedin className="w-5 h-5" />
            </a>
            <a href="mailto:support@footylytics.com" className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400 transition-colors">
              <FiMail className="w-5 h-5" />
            </a>
          </div>

          <div className="flex items-center justify-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
            <span>Made with</span>
            <FiHeart className="w-3 h-3 text-red-500" />
            <span>for football fans</span>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-400">
            © {currentYear} Footylytics
          </p>
          
          <div className="flex justify-center space-x-4 text-xs">
            <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop: Full Layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/flogo.svg" alt="Footylytics" className="h-8 w-8" />
              <span className="text-xl font-bold text-primary-light dark:text-primary-dark">
                Footylytics
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              AI-powered football predictions and live scores for all major leagues.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/live" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                  Live Scores
                </Link>
              </li>
              <li>
                <Link to="/fixtures" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                  Fixtures
                </Link>
              </li>
              <li>
                <Link to="/standings/2001" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                  Standings
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/predictions" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                  AI Predictions
                </Link>
              </li>
              <li>
                <Link to="/my-team" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                  My Team
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="mailto:support@footylytics.com" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                <FiMail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              support@footylytics.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Footylytics. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <span>Made with</span>
              <FiHeart className="w-4 h-4 text-red-500" />
              <span>for football fans</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
