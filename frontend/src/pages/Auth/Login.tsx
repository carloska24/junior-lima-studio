import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-midnight-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-midnight-800 border border-gold-500/30 rounded-full flex items-center justify-center mb-6">
            <span className="font-serif text-gold-500 text-xl font-bold">JL</span>
          </div>
          <h2 className="text-3xl font-serif text-white">Área Restrita</h2>
          <p className="mt-2 text-gray-400 text-sm">Acesso exclusivo para administração</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-midnight-800/50 border border-midnight-700 p-8 rounded-sm shadow-xl"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full bg-midnight-900 border border-midnight-700 rounded p-3 text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="admin@juniorlima.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full bg-midnight-900 border border-midnight-700 rounded p-3 text-white focus:outline-none focus:border-gold-500/50 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gold-500 text-midnight-900 hover:bg-gold-400"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Acessar Sistema'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
