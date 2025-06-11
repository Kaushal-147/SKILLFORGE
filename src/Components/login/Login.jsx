import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/dashboard');
  const [modalStage, setModalStage] = useState('loading');
  const modalRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      setRedirectPath(result.redirectPath || '/dashboard');
      setShowSuccessModal(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);
    navigate(redirectPath);
  };

  useEffect(() => {
    if (showSuccessModal) {
      setModalStage('loading');
      const timer = setTimeout(() => setModalStage('success'), 1000);
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') handleModalOk();
      };

      const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) handleModalOk();
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('mousedown', handleClickOutside);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'auto';
      };
    }
  }, [showSuccessModal]);

  return (
    <>
      <div className="min-h-screen flex login-page-container">
        <div className="flex-1 flex items-center justify-center p-8 leftside">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold">Login</h1>
              <p className="text-gray-500">Enter your account details</p>
            </div>

            {(error || authError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error || authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223C2.964 9.748 2.25 11.437 2.25 12c0 .563.714 2.252 1.73 3.777M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.52 10.52 0 01-4.293 5.774M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5s8.573 3.007 9.963 7.178a1.013 1.013 0 010 .639C20.577 16.49 16.64 19.5 12 19.5s-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-75"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              <div className="or mt-4 text-center text-sm text-gray-600">Or</div>
              <button
                type="button"
                onClick={() => window.location.href = '/api/auth/google'}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-2"
              >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600 donthave">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                    SignUp
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden lg:block flex-1 bg-[#3A5BF3] text-white relative overflow-hidden">
          <div className="flex flex-col h-full items-center justify-center p-12">
            <div className="text-center mb-8 z-10">
              <h2 className="text-4xl font-bold mb-4">Welcome</h2>
            </div>
            <div className="flex justify-center items-center flex-grow z-10">
              <img
                src="/student-illustration.png"
                alt="Students celebrating"
                className="w-3/5 h-auto"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400/3A5BF3/FFFFFF?text=Add+Your+Image";
                  e.target.onerror = null;
                }}
              />
            </div>
            <div className="text-center mt-8 z-10">
              <p className="text-xl text-indigo-100">Login to access your account</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 rounded-full bg-[#3A5BF3] opacity-30"></div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="logout-modal-overlay" role="dialog" aria-modal="true">
          <div className="logout-modal-content" ref={modalRef}>
            {modalStage === 'loading' ? (
              <div className="spinner" />
            ) : (
              <svg className="check-icon animate-scale" viewBox="0 0 24 24" fill="none">
                <path d="M9 16.17l-3.59-3.59L4 14l5 5 12-12-1.41-1.42z" fill="currentColor" />
              </svg>
            )}
            <p>Login successful</p>
            <button
              className="logout-modal-ok-btn"
              onClick={handleModalOk}
              disabled={modalStage !== 'success'}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
