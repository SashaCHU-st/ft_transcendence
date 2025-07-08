import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { validateEmail, validatePassword } from '../../../utils/InputValidation';
import TwoFactorForm from './TwoFactorForm';

const SignInForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setEmailError(emailError);
    setPasswordError(passwordError);
    if (emailError || passwordError) return;

    setLoading(true);
    try {
      const res = await fetch('https://localhost:3000/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (data?.twoFactor === true) {
        const sendRes = await fetch('https://localhost:3000/2fa/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!sendRes.ok) {
          const sendData = await sendRes.json();
          throw new Error(sendData.message || 'Failed to send 2FA code');
        }

        setIs2FARequired(true);
        toast('2FA code sent to email');
      } else {
        login(data.accessToken);
        localStorage.setItem('id', data.id);
        toast.success('All good');
        onSuccess();
        navigate('/profile');
      }
    } catch (error: any) {
      setError(error.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASuccess = (accessToken: string, id: string) => {
    login(accessToken);
    localStorage.setItem('id', id);
    toast.success('2FA complete');
    onSuccess();
    navigate('/profile');
  };

  const handleCancel2FA = () => {
    setIs2FARequired(false);
    setError('');
  };
  if (is2FARequired) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold font-orbitron mb-5 text-center tracking-[.10em]">
          2FA Verification
        </h2>
        <TwoFactorForm
          email={email}
          onSuccess={handle2FASuccess}
          onBack={handleCancel2FA}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold font-orbitron mb-5 text-center tracking-[.10em]">
        LOGIN
      </h2>

      {err && <p className="text-red-500 text-center">{err}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Email"
            autoFocus
            className="w-full px-4 py-2 bg-black text-white bg-opacity-30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(validateEmail(e.target.value));
            }}
            required
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-2 bg-black text-white bg-opacity-30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setPasswordError(validatePassword(value));
              }}
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-400 hover:text-white focus:outline-none"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 bg-indigo-950 font-orbitron tracking-[.10em] hover:bg-rose-950 text-white font-medium py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Wait' : 'LOGIN'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
