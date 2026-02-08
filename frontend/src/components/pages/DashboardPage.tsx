import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Card } from '../Card';
import { Badge } from '../Badge';

import { 
  Search, 
  Filter, 
  FileCheck, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Download, 
  Share2 
} from 'lucide-react';

import { motion } from 'motion/react';

interface DashboardPageProps {
  onNavigate: (page: string, caseId?: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {

  const [searchQuery, setSearchQuery] = useState('');
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const res = await axios.get(
        'http://localhost:8000/api/detect/cases'
      );
      setCases(res.data.cases);
    } catch (err) {
      console.error('Failed loading cases', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(c =>
    c.case_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCases = cases.length;
  const aiDetected = cases.filter(c => c.is_ai_generated).length;
  const todayScans = cases.filter(c => {
    const today = new Date().toDateString();
    return new Date(c.created_at).toDateString() === today;
  }).length;

  const stats = [
    { label: 'Total Cases', value: totalCases.toString(), icon: FileCheck },
    { label: 'Active Investigations', value: totalCases.toString(), icon: TrendingUp },
    { label: 'AI-Detected', value: aiDetected.toString(), subtext: `(${totalCases ? Math.round((aiDetected / totalCases) * 100) : 0}%)`, icon: AlertTriangle },
    { label: "Today's Scans", value: todayScans.toString(), icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 py-12">

      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold">Dashboard</h1>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-gray-600 text-sm mb-1">{stat.label}</div>
                  <div className="text-3xl font-bold flex items-baseline gap-2">
                    {stat.value}
                    {stat.subtext && <span className="text-lg text-gray-500">{stat.subtext}</span>}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50">
                  <stat.icon className="text-blue-500" size={24} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by Case ID, File name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
              <Filter size={18} /> Apply
            </button>
          </div>
        </Card>

        {/* Cases Table */}
        <Card>

          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Cases</h2>
          </div>

          {loading && (
            <div className="text-center py-10 text-gray-600">
              Loading cases...
            </div>
          )}

          {!loading && filteredCases.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              No cases found
            </div>
          )}

          {!loading && filteredCases.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Case ID</th>
                    <th className="px-4 py-3 text-left">File Name</th>
                    <th className="px-4 py-3 text-left">Result</th>
                    <th className="px-4 py-3 text-left">Confidence</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {filteredCases.map((c, index) => {

                    const confidence = Math.round(c.confidence * 100);

                    return (
                      <motion.tr
                        key={c.case_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => onNavigate('results', c.case_id)}
                      >

                        <td className="px-4 py-4 font-mono text-blue-600">
                          {c.case_id}
                        </td>

                        <td className="px-4 py-4">
                          {c.filename}
                        </td>

                        <td className="px-4 py-4">
                          <Badge variant={c.is_ai_generated ? 'danger' : 'success'}>
                            {c.is_ai_generated ? 'AI-Generated' : 'Authentic'}
                          </Badge>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{ width: `${confidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{confidence}%</span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {new Date(c.created_at).toLocaleString()}
                        </td>

                        <td className="px-4 py-4 flex gap-2">

                          <button onClick={() => onNavigate('results', c.case_id)}>
                            <Eye size={16} />
                          </button>

                          <button onClick={() => onNavigate('reports')}>
                            <Download size={16} />
                          </button>

                          <button>
                            <Share2 size={16} />
                          </button>

                        </td>

                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </Card>

      </div>
    </div>
  );
}