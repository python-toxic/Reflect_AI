import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import PageTransition from '@/components/PageTransition';
import { BookOpenText, Sparkles, LayoutDashboard } from "lucide-react";

export default function Selection() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-cover bg-center pt-16" style={{ backgroundImage: 'url("/src/components/images/selection.png")' }}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white text-center mb-12">Welcome to Your Wellness Journey</h1>
          <div className="grid md:grid-cols-3 gap-8 mx-auto">
            <Card onClick={() => navigate('/journal')} className="bg-white/10 hover:bg-white/20 cursor-pointer">
              <CardContent className="p-8">
                <BookOpenText className="h-12 w-12 text-white" />
                <h2 className="text-2xl font-semibold text-white">Daily Journal</h2>
                <p className="text-white/80">Express your thoughts and explore your mental well-being.</p>
              </CardContent>
            </Card>

            <Card onClick={() => navigate('/counselor')} className="bg-white/10 hover:bg-white/20 cursor-pointer">
              <CardContent className="p-8">
                <Sparkles className="h-12 w-12 text-white" />
                <h2 className="text-2xl font-semibold text-white">AI Counselor</h2>
                <p className="text-white/80">Get support and personalized coping strategies.</p>
              </CardContent>
            </Card>

            <Card onClick={() => navigate('/dashboard')} className="bg-white/10 hover:bg-white/20 cursor-pointer">
              <CardContent className="p-8">
                <LayoutDashboard className="h-12 w-12 text-white" />
                <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
                <p className="text-white/80">Your Progress</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
