import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageTransition from '@/components/PageTransition';
import { Brain, BookOpenText, TrendingUp, Shield, Heart, Sparkles } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: 'url("/src/components/images/home.png")',
        }}
      >
        <div className="min-h-screen bg-black/30">
          {/* Hero Section */}
          <div className="container mx-auto px-4 pt-32 pb-16">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <Brain className="h-16 w-16 text-white animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                Your Mental Wellness
                <span className="text-primary"> Journey</span>
              </h1>
              <p className="text-xl text-white/80">
                Empowering you through AI-driven journaling and personalized counseling for better mental health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" className="text-lg" onClick={() => navigate('/login')}>
                  Start Your Journey
                </Button>
                <Button
                  onClick={() => navigate('/about', { state: { from: '/' } })}
                  size="lg"
                  variant="outline"
                  className="text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="container mx-auto px-4 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Smart Journaling */}
              <Card className="backdrop-blur-md bg-white/10 border-white/20">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-white/10">
                      <BookOpenText className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">Smart Journaling</h2>
                  </div>
                  <p className="text-white/80">
                    Express your thoughts freely while our AI analyzes patterns to help you understand your mental well-being journey.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-white/80">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>Private and secure journaling</span>
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span>Pattern recognition and insights</span>
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Heart className="h-5 w-5 text-primary" />
                      <span>Personalized well-being tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* AI Counselor */}
              <Card className="backdrop-blur-md bg-white/10 border-white/20">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-white/10">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">AI Counselor</h2>
                  </div>
                  <p className="text-white/80">
                    Access supportive guidance anytime with our AI counselor, trained to provide empathetic and helpful mental health support.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-white/80">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>24/7 confidential support</span>
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span>Evidence-based techniques</span>
                    </li>
                    <li className="flex items-center gap-2 text-white/80">
                      <Heart className="h-5 w-5 text-primary" />
                      <span>Personalized coping strategies</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}