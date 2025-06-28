import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Props {
  email: string;
  onSuccess: (accessToken: string, id: string) => void;
  onBack?: () => void;
}

const TwoFactorForm: React.FC<Props> = ({ email, onSuccess, onBack }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      setLoading(true);
      const res = await fetch('https://localhost:3000/2fa/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed to resend');
      toast.success('Code sent again');
      setResendCooldown(60);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await fetch('https://localhost:3000/2fa/email/verify', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSuccess(data.accessToken, data.id);
      toast.success('2FA all good');
    } catch (err: any) {
      setError(err.message || 'Wrong 2FA code');
      toast.error(err.message || 'Wrong 2FA code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="space-y-2">
        <input
          type="text"
          placeholder="2FA code from email"
          className="w-full px-4 py-2 bg-black text-white bg-opacity-30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button
          type="button"
          disabled={resendCooldown > 0 || loading}
          onClick={handleResend}
          className={`mt-2 text-sm font-medium ${
            resendCooldown > 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-400 hover:underline cursor-pointer'
          }`}
        >
          {resendCooldown > 0 ? `Send again ${resendCooldown}s` : 'Send again'}
        </button>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="w-1/2 bg-indigo-950 font-orbitron tracking-[.10em] hover:bg-rose-950 text-white font-medium py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Wait' : 'Confirm code'}
        </button>
      </div>
    </form>
  );
};

export default TwoFactorForm;
