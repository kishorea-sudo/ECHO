import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Droplets,
  Thermometer,
  Zap,
  MapPin,
  Scissors
} from "lucide-react";

// Mock historical data
const generateHistoricalData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      timestamp: date.toISOString().split('T')[0],
      ph: 7.0 + Math.sin(i / 10) * 0.5 + Math.random() * 0.4,
      tds: 240 + Math.sin(i / 15) * 30 + Math.random() * 20,
      temperature: 18 + Math.sin(i / 8) * 3 + Math.random() * 2,
      harvestWeight: Math.max(0, Math.sin(i / 7) * 20 + Math.random() * 15),
      batteryLevel: Math.max(20, 100 - (i % 5) * 15 + Math.random() * 10),
      operatingHours: Math.random() * 8,
    });
  }
  
  return data;
};

const last7Days = generateHistoricalData(7);
const last30Days = generateHistoricalData(30);
const last90Days = generateHistoricalData(90);

interface AnalyticsPanelProps {}

export function AnalyticsPanel({}: AnalyticsPanelProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('water_quality');

  const getDataForTimeRange = () => {
    switch (timeRange) {
      case '7d': return last7Days;
      case '30d': return last30Days;
      case '90d': return last90Days;
      default: return last7Days;
    }
  };

  const data = getDataForTimeRange();

  const exportData = (format: 'csv' | 'json') => {
    const dataToExport = data;
    let content = '';
    let mimeType = '';
    let fileName = '';

    if (format === 'csv') {
      const headers = Object.keys(dataToExport[0]).join(',');
      const rows = dataToExport.map(row => Object.values(row).join(','));
      content = [headers, ...rows].join('\n');
      mimeType = 'text/csv';
      fileName = `echo-harvester-data-${timeRange}.csv`;
    } else {
      content = JSON.stringify(dataToExport, null, 2);
      mimeType = 'application/json';
      fileName = `echo-harvester-data-${timeRange}.json`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const calculateTrend = (metric: keyof typeof data[0]) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((sum, item) => sum + Number(item[metric]), 0) / 3;
    const older = data.slice(0, 3).reduce((sum, item) => sum + Number(item[metric]), 0) / 3;
    return ((recent - older) / older) * 100;
  };

  const getMetricStats = () => {
    const stats = {
      ph: {
        current: data[data.length - 1]?.ph.toFixed(2) || '0',
        trend: calculateTrend('ph'),
        unit: 'pH',
        icon: <Droplets className="w-5 h-5 text-blue-500" />
      },
      tds: {
        current: data[data.length - 1]?.tds.toFixed(0) || '0',
        trend: calculateTrend('tds'),
        unit: 'ppm',
        icon: <Zap className="w-5 h-5 text-primary" />
      },
      temperature: {
        current: data[data.length - 1]?.temperature.toFixed(1) || '0',
        trend: calculateTrend('temperature'),
        unit: '°C',
        icon: <Thermometer className="w-5 h-5 text-orange-500" />
      },
      harvest: {
        current: data.reduce((sum, item) => sum + item.harvestWeight, 0).toFixed(1),
        trend: calculateTrend('harvestWeight'),
        unit: 'kg',
        icon: <Scissors className="w-5 h-5 text-green-500" />
      }
    };
    return stats;
  };

  const stats = getMetricStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Data Analytics</h1>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('csv')}
            className="border-green-500 text-green-500 hover:bg-green-500/10"
          >
            <Download className="w-4 h-4 mr-1" />
            Export CSV
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('json')}
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Download className="w-4 h-4 mr-1" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, stat]) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                {stat.icon}
                <div className={`flex items-center space-x-1 ${
                  stat.trend > 0 ? 'text-green-500' : stat.trend < 0 ? 'text-red-500' : 'text-muted-foreground'
                }`}>
                  {stat.trend > 0 ? <TrendingUp className="w-4 h-4" /> : 
                   stat.trend < 0 ? <TrendingDown className="w-4 h-4" /> : 
                   <Activity className="w-4 h-4" />}
                  <span className="text-xs">{Math.abs(stat.trend).toFixed(1)}%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">
                {stat.current}
                <span className="text-sm text-muted-foreground ml-1">{stat.unit}</span>
              </div>
              <div className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Selection */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground">View:</span>
        <div className="flex space-x-2">
          {[
            { id: 'water_quality', label: 'Water Quality' },
            { id: 'harvest', label: 'Harvest Data' },
            { id: 'system', label: 'System Metrics' }
          ].map((option) => (
            <Button
              key={option.id}
              variant={selectedMetric === option.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedMetric === 'water_quality' && (
          <>
            {/* pH Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span>pH Levels Over Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                      domain={[6.5, 8.5]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #3b82f6',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ph" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* TDS Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>TDS Levels Over Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #10b981',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tds" 
                      stroke="#10b981" 
                      fill="#10b981"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {selectedMetric === 'harvest' && (
          <>
            {/* Harvest Weight */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scissors className="w-5 h-5 text-green-500" />
                  <span>Daily Harvest Weight</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #10b981',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="harvestWeight" 
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Daily Operating Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #3b82f6',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="operatingHours" 
                      stroke="#3b82f6" 
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {selectedMetric === 'system' && (
          <>
            {/* Battery Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  <span>Battery Level</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #10b981',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="batteryLevel" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Temperature Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  <span>Temperature Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #f59e0b',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Summary Statistics ({timeRange})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {data.reduce((sum, item) => sum + item.harvestWeight, 0).toFixed(1)} kg
              </div>
              <div className="text-sm text-muted-foreground">Total Harvest</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {data.reduce((sum, item) => sum + item.operatingHours, 0).toFixed(1)} hrs
              </div>
              <div className="text-sm text-muted-foreground">Operating Time</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {(data.reduce((sum, item) => sum + item.ph, 0) / data.length).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Avg pH</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {(data.reduce((sum, item) => sum + item.temperature, 0) / data.length).toFixed(1)}°C
              </div>
              <div className="text-sm text-muted-foreground">Avg Temp</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}