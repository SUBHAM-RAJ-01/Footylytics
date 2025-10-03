import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, session } = useAuth();
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState('Activating your premium features...');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      navigate('/pricing');
      return;
    }

    const activatePremium = async () => {
      try {
        console.log('🎉 Payment successful! Activating premium...');
        
        if (!user || !session) {
          console.log('⏳ Waiting for user session...');
          setMessage('Loading user session...');
          return;
        }

        console.log('👤 User:', user.email);
        console.log('💳 Session ID:', sessionId);
        setMessage('Activating premium...');

        // Call backend to activate premium
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/payments/activate-premium`,
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          }
        );

        console.log('✅ Response:', response.data);
        setMessage('Premium activated! Redirecting...');
        setChecking(false);

        // Force reload to ensure profile updates everywhere
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (error) {
        console.error('❌ Activation error:', error);
        console.error('Error details:', error.response?.data);
        setMessage(error.response?.data?.error || 'Activation failed. Redirecting...');
        setChecking(false);
        
        // Redirect anyway after 3 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    };

    // Wait for user to be loaded
    if (user && session) {
      activatePremium();
    }
  }, [user, session, searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl">
          <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Welcome to Footylytics Premium! 🎉
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <FiLoader className="animate-spin" />
            <span>{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
