import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Sign_in/Sign_in.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, error: authError } = useAuth();

  const [showOAuthRoleModal, setShowOAuthRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/dashboard');
  const [modalStage, setModalStage] = useState('loading');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const user = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      const path = user.role === 'instructor' ? '/instructor-dashboard' : '/dashboard';
      setRedirectPath(path);
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const handleOAuthContinue = () => {
    setShowOAuthRoleModal(false);
    window.location.href = `/api/auth/google?role=${selectedRole}`;
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold signup-title">Sign Up</h1>
              <p className="text-gray-500">Create your account</p>
            </div>

            {(error || authError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error || authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
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
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12M12 4.5c4.76 0 8.78 3.16 10.07 7.5a10.52 10.52 0 01-4.29 5.77M6.23 6.23A10.45 10.45 0 001.93 12c1.3 4.34 5.25 7.5 9.99 7.5.99 0 1.95-.14 2.86-.39" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.04 12.32a1.01 1.01 0 010-.64C3.42 7.51 7.36 4.5 12 4.5s8.58 3.01 9.96 7.18a1.01 1.01 0 010 .64C20.58 16.49 16.64 19.5 12 19.5s-8.58-3.01-9.96-7.18z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Account Type
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.role === 'instructor'
                      ? 'Instructor accounts can create and manage courses.'
                      : 'Student accounts can enroll in and take courses.'}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75"
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <div className="mt-4 text-center text-sm text-gray-600 Or">Or</div>
              <button
                type="button"
                onClick={() => setShowOAuthRoleModal(true)}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-2"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  className="w-5 h-5 mr-2"
                />
                Continue with Google
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 alreadyhave">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right - Banner */}
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
              <p className="text-xl text-indigo-100">Create an account to get started</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 rounded-full bg-[#3A5BF3] opacity-30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal-content">
            {modalStage === 'loading' ? (
              <div className="spinner" />
            ) : (
              <svg className="check-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9 16.17l-3.59-3.59L4 14l5 5 12-12-1.41-1.42z" />
              </svg>
            )}
            <p>Signup successful</p>
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

      {/* Google Role Modal */}
      {showOAuthRoleModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal-content">
            <h3 className="text-lg font-medium mb-4">Select Account Type</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="student-role"
                  name="role"
                  value="student"
                  checked={selectedRole === 'student'}
                  onChange={() => setSelectedRole('student')}
                  className="h-4 w-4 text-indigo-600"
                />
                <label htmlFor="student-role" className="ml-3 text-sm font-medium text-gray-700">
                  Student (I want to take courses)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="instructor-role"
                  name="role"
                  value="instructor"
                  checked={selectedRole === 'instructor'}
                  onChange={() => setSelectedRole('instructor')}
                  className="h-4 w-4 text-indigo-600"
                />
                <label htmlFor="instructor-role" className="ml-3 text-sm font-medium text-gray-700">
                  Instructor (I want to create courses)
                </label>
              </div>
            </div>
            <button
              className="logout-modal-ok-btn mt-6"
              onClick={handleOAuthContinue}
            >
              Continue with Google
            </button>
            <button
              className="logout-modal-ok-btn mt-4"
              onClick={() => setShowOAuthRoleModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;
