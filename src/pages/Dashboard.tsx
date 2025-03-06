// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { BookOpenText, Sparkles, Brain, TrendingUp, Calendar, AlertCircle, User, Clock } from "lucide-react";
// import { Progress } from "@/components/ui/progress";
// import PageTransition from '@/components/PageTransition';

// interface DashboardMetrics {
//   depression: number;
//   anxiety: number;
//   stress: number;
//   sleep: number;
//   mood: number;
//   recentActivities: {
//     type: string;
//     date: number;
//     description: string;
//   }[];
// }
// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMetrics = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await fetch('http://localhost:5000/dashboard-metrics', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setMetrics(data);
//         } else {
//           console.error('Failed to fetch metrics');
//         }
//       } catch (error) {
//         console.error('Error fetching metrics:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMetrics();
//   }, []);

//   // Default metrics if none are available yet
//   const mentalHealthMetrics = metrics || {
//     depression: 60,
//     anxiety: 55,
//     stress: 42,
//     sleep: 77,
//     mood: 72,
//     recentActivities: [
//       { type: 'Journal', date: 2, description: 'Completed daily reflection' },
//       { type: 'Counseling', date: 24, description: 'AI counseling session' },
//       { type: 'Assessment', date: 72, description: 'Weekly mental health check' }
//     ]
//   };

//   const formatActivityDate = (days: number) => {
//     if (days === 0) return 'Today';
//     if (days === 1) return 'Yesterday';
//     if (days < 7) return `${days} days ago`;
//     if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
//     return `${Math.floor(days / 30)} months ago`;
//   };

//   const upcomingReminders = [
//     'Daily journal entry',
//     'Weekly mood tracking',
//     'Mindfulness session'
//   ];

//   return (
//     <PageTransition>
//       <div
//         className="min-h-screen bg-cover bg-center pt-16"
//         style={{
//           backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url("/src/components/images/dashboard.png")',
//         }}
//       >
//         <div className="container mx-auto px-4 py-8">
//           {/* User Welcome Section */}
//           <Card className="backdrop-blur-md bg-white/10 border-white/20 mb-8">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 rounded-full bg-white/10">
//                   <User className="h-8 w-8 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold text-white">Welcome!</h1>
//                   <p className="text-white/80">Let's check on your well-being today</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {/* Mental Health Insights */}
//             <Card className="backdrop-blur-md bg-white/10 border-white/20 lg:col-span-2">
//               <CardHeader>
//                 <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
//                   <Brain className="h-5 w-5" />
//                   Mental Health Insights
//                   {loading && <span className="text-sm ml-2">(Loading...)</span>}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {Object.entries(mentalHealthMetrics)
//                   .filter(([key]) => key !== 'recentActivities')
//                   .map(([metric, value]) => (
//                     <div key={metric} className="space-y-2">
//                       <div className="flex justify-between text-white">
//                         <span className="capitalize">{metric}</span>
//                         <span>{value}%</span>
//                       </div>
//                       <Progress value={value} className="bg-white/10" />
//                     </div>
//                   ))}
//               </CardContent>
//             </Card>

//             {/* Quick Actions */}
//             <Card className="backdrop-blur-md bg-white/10 border-white/20">
//               <CardHeader>
//                 <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
//                   <TrendingUp className="h-5 w-5" />
//                   Quick Actions
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 gap-4">
//                   <Card
//                     className="backdrop-blur-md bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-all"
//                     onClick={() => navigate('/journal')}
//                   >
//                     <CardContent className="p-4 flex flex-col items-center text-white">
//                       <BookOpenText className="h-8 w-8 mb-2" />
//                       <span>Journal</span>
//                     </CardContent>
//                   </Card>
//                   <Card
//                     className="backdrop-blur-md bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-all"
//                     onClick={() => navigate('/counselor')}
//                   >
//                     <CardContent className="p-4 flex flex-col items-center text-white">
//                       <Sparkles className="h-8 w-8 mb-2" />
//                       <span>Counselor</span>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Recent Activity */}
//             <Card className="backdrop-blur-md bg-white/10 border-white/20">
//               <CardHeader>
//                 <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
//                   <Clock className="h-5 w-5" />
//                   Recent Activity
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {mentalHealthMetrics.recentActivities.map((activity, index) => (
//                     <div key={index} className="flex items-start gap-3 text-white">
//                       <div className="p-2 rounded-full bg-white/10">
//                         {activity.type === 'Journal' ? (
//                           <BookOpenText className="h-4 w-4" />
//                         ) : activity.type === 'Counseling' ? (
//                           <Sparkles className="h-4 w-4" />
//                         ) : (
//                           <AlertCircle className="h-4 w-4" />
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-medium">{activity.description}</p>
//                         <p className="text-sm text-white/60">{formatActivityDate(activity.date)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Upcoming Reminders */}
//             <Card className="backdrop-blur-md bg-white/10 border-white/20 lg:col-span-2">
//               <CardHeader>
//                 <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
//                   <Calendar className="h-5 w-5" />
//                   Upcoming Reminders
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {upcomingReminders.map((reminder, index) => (
//                     <Card key={index} className="backdrop-blur-md bg-white/5 border-white/10">
//                       <CardContent className="p-4">
//                         <p className="text-white">{reminder}</p>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </PageTransition>
//   );
// }
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText, Sparkles, Brain, TrendingUp, Calendar, AlertCircle, User, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import PageTransition from '@/components/PageTransition';
import { io } from 'socket.io-client';

interface DashboardMetrics {
  depression: number;
  anxiety: number;
  stress: number;
  sleep: number;
  mood: number;
  recentActivities: {
    type: string;
    date: number;
    description: string;
  }[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId'); // Assume user ID is stored here

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/dashboard-metrics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        console.error('Failed to fetch metrics');
        setMetrics({
          depression: 60,
          anxiety: 55,
          stress: 42,
          sleep: 77,
          mood: 72,
          recentActivities: [
            { type: 'Journal', date: 2, description: 'Completed daily reflection' },
            { type: 'Counseling', date: 24, description: 'AI counseling session' },
            { type: 'Assessment', date: 72, description: 'Weekly mental health check' }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setMetrics({
        depression: 60,
        anxiety: 55,
        stress: 42,
        sleep: 77,
        mood: 72,
        recentActivities: [
          { type: 'Journal', date: 2, description: 'Completed daily reflection' },
          { type: 'Counseling', date: 24, description: 'AI counseling session' },
          { type: 'Assessment', date: 72, description: 'Weekly mental health check' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Set up WebSocket connection
    const socket = io('http://localhost:5000');
    socket.on(`metricsUpdate_${userId}`, (newMetrics: DashboardMetrics) => {
      setMetrics(newMetrics);
    });

    return () => {
      socket.disconnect(); // Clean up on unmount
    };
  }, [userId]);

  const formatActivityDate = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const upcomingReminders = [
    'Daily journal entry',
    'Weekly mood tracking',
    'Mindfulness session'
  ];

  return (
    <PageTransition>
      <div
        className="min-h-screen bg-cover bg-center pt-16"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url("/src/components/images/dashboard.png")',
        }}
      >
        <div className="container mx-auto px-4 py-8">
          {/* User Welcome Section */}
          <Card className="backdrop-blur-md bg-white/10 border-white/20 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-white/10">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Welcome!</h1>
                  <p className="text-white/80">Let's check on your well-being today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mental Health Insights */}
            <Card className="backdrop-blur-md bg-white/10 border-white/20 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Mental Health Insights
                  {loading && <span className="text-sm ml-2">(Loading...)</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(metrics || {
                  depression: 60,
                  anxiety: 55,
                  stress: 42,
                  sleep: 77,
                  mood: 72
                })
                  .filter(([key]) => key !== 'recentActivities')
                  .map(([metric, value]) => (
                    <div key={metric} className="space-y-2">
                      <div className="flex justify-between text-white">
                        <span className="capitalize">{metric}</span>
                        <span>{value}%</span>
                      </div>
                      <Progress value={value} className="bg-white/10" />
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Card
                    className="backdrop-blur-md bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                    onClick={() => navigate('/journal')}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-white">
                      <BookOpenText className="h-8 w-8 mb-2" />
                      <span>Journal</span>
                    </CardContent>
                  </Card>
                  <Card
                    className="backdrop-blur-md bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                    onClick={() => navigate('/counselor')}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-white">
                      <Sparkles className="h-8 w-8 mb-2" />
                      <span>Counselor</span>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(metrics?.recentActivities || [
                    { type: 'Journal', date: 2, description: 'Completed daily reflection' },
                    { type: 'Counseling', date: 24, description: 'AI counseling session' },
                    { type: 'Assessment', date: 72, description: 'Weekly mental health check' }
                  ]).map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 text-white">
                      <div className="p-2 rounded-full bg-white/10">
                        {activity.type === 'Journal' ? (
                          <BookOpenText className="h-4 w-4" />
                        ) : activity.type === 'Counseling' ? (
                          <Sparkles className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-white/60">{formatActivityDate(activity.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Reminders */}
            <Card className="backdrop-blur-md bg-white/10 border-white/20 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {upcomingReminders.map((reminder, index) => (
                    <Card key={index} className="backdrop-blur-md bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <p className="text-white">{reminder}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <button onClick={fetchMetrics} style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Refresh Metrics
          </button>
        </div>
      </div>
    </PageTransition>
  );
}