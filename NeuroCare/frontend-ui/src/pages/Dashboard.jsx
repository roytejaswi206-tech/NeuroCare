import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { healthAPI, predictAPI } from '../services/api';
import { Activity, Heart, Moon, TrendingUp, Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useToast } from '../components/ToastContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [formData, setFormData] = useState({
    bp: '',
    sugar: '',
    sleep: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  
  useEffect(() => {
    fetchHealthData();
  }, []);
  
  const fetchHealthData = async () => {
    try {
      const response = await healthAPI.getHealthData({ limit: 10 });
      setHealthData(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch health data:', err);
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handlePredict = async () => {
    setLoading(true);
    try {
      const data = {
        bp: formData.bp || null,
        sugar: formData.sugar ? parseInt(formData.sugar) : null,
        sleep: formData.sleep ? parseFloat(formData.sleep) : null,
      };
      const response = await predictAPI.predict(data);
      setPrediction(response.data);
      showToast('Analysis complete. Check your risk summary.', 'success');
    } catch (err) {
      console.error('Prediction failed:', err);
      showToast('Health analysis failed. Please verify your inputs.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveData = async () => {
    setSaving(true);
    try {
      const data = {
        bp: formData.bp || null,
        sugar: formData.sugar ? parseInt(formData.sugar) : null,
        sleep: formData.sleep ? parseFloat(formData.sleep) : null,
      };
      await healthAPI.addHealthData(data);
      await fetchHealthData();
      setFormData({ bp: '', sugar: '', sleep: '' });
      setPrediction(null);
      showToast('Health entry saved successfully.', 'success');
    } catch (err) {
      console.error('Failed to save health data:', err);
      showToast('Unable to save health data. Try again later.', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  const chartData = {
    labels: healthData.slice().reverse().map((d) =>
      new Date(d.created_at).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Blood Sugar',
        data: healthData.slice().reverse().map((d) => d.sugar),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
      },
    ],
  };
  
  const pieData = {
    labels: ['Sleep < 6h', 'Sleep 6-8h', 'Sleep > 8h'],
    datasets: [
      {
        data: [
          healthData.filter((d) => d.sleep && d.sleep < 6).length,
          healthData.filter((d) => d.sleep >= 6 && d.sleep <= 8).length,
          healthData.filter((d) => d.sleep > 8).length,
        ],
        backgroundColor: ['#ef4444', '#10b981', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };
  
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-neuro-success';
      case 'Moderate': return 'text-neuro-warning';
      case 'High': return 'text-orange-500';
      case 'Critical': return 'text-neuro-danger';
      default: return 'text-gray-400';
    }
  };
  
  return (
    <div className="min-h-screen bg-neuro-dark pb-20 md:pb-4">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-4 pt-20 md:pt-4">
        <h1 className="text-2xl font-bold mb-6 neon-text">Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Input Section */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Health Metrics</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  <Activity className="inline mr-2" size={16} />
                  Blood Pressure (systolic/diastolic)
                </label>
                <input
                  type="text"
                  name="bp"
                  value={formData.bp}
                  onChange={handleChange}
                  placeholder="e.g., 120/80"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  <Heart className="inline mr-2" size={16} />
                  Blood Sugar (mg/dL)
                </label>
                <input
                  type="number"
                  name="sugar"
                  value={formData.sugar}
                  onChange={handleChange}
                  placeholder="e.g., 100"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  <Moon className="inline mr-2" size={16} />
                  Sleep Hours
                </label>
                <input
                  type="number"
                  name="sleep"
                  value={formData.sleep}
                  onChange={handleChange}
                  placeholder="e.g., 7"
                  step="0.5"
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handlePredict}
                  disabled={loading}
                  className="flex-1 neon-button text-white py-2"
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
                <button
                  onClick={handleSaveData}
                  disabled={saving}
                  className="flex-1 bg-neuro-card border border-neuro-accent text-neuro-accent hover:bg-neuro-accent hover:text-white py-2 px-4 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save
                </button>
              </div>
            </div>
          </div>
          
          {/* Prediction Result */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">
              <TrendingUp className="inline mr-2" size={20} />
              Health Analysis
            </h2>
            
            {prediction ? (
              <div className="animate-fade-in">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-400">Risk Level</p>
                  <p className={`text-4xl font-bold ${getRiskColor(prediction.risk)}`}>
                    {prediction.risk}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Confidence: {Math.round(prediction.confidence * 100)}%
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Suggestions:</p>
                  {prediction.suggestions.slice(0, 3).map((suggestion, index) => (
                    <p key={index} className="text-sm bg-neuro-card/50 p-2 rounded">
                      • {suggestion}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Activity size={48} className="mx-auto mb-4 opacity-50" />
                <p>Enter your health metrics and click Analyze</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Charts */}
        {healthData.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Blood Sugar Trend</h3>
              <Line data={chartData} options={{ plugins: { legend: { display: false } } }} />
            </div>
            
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Sleep Distribution</h3>
              <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
