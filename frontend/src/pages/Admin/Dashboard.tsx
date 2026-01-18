import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface DashboardStats {
  totalAppointments: number;
  totalClients: number;
  totalRevenue: number;
  appointmentsToday: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('@JuniorLima:token');
        const response = await fetch('http://localhost:3333/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-gold-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-serif text-midnight-900">Dashboard</h1>
        <p className="text-gray-500">Visão geral do seu negócio.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Faturamento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
            Faturamento Total
          </h3>
          <p className="text-3xl font-serif text-gold-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              stats?.totalRevenue || 0
            )}
          </p>
          <span className="text-xs text-green-500 font-medium">Receita confirmada (Completed)</span>
        </motion.div>

        {/* Card 2: Agendamentos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
            Agendamentos
          </h3>
          <p className="text-3xl font-serif text-midnight-900">{stats?.totalAppointments || 0}</p>
          <span className="text-xs text-gray-400 font-medium">
            {stats?.appointmentsToday || 0} para hoje
          </span>
        </motion.div>

        {/* Card 3: Clientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
            Clientes
          </h3>
          <p className="text-3xl font-serif text-midnight-900">{stats?.totalClients || 0}</p>
          <span className="text-xs text-gray-400 font-medium">Total cadastrado</span>
        </motion.div>
      </div>
    </div>
  );
}
