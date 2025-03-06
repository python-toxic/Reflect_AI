import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Shield, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PageTransition from '@/components/PageTransition';

export default function About() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user came from the home page (for showing/hiding the back button)
  const isComingFromHome = location.state?.from === '/';

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Mental Health Support",
      description: "Our platform combines advanced AI technology with evidence-based mental health practices to provide personalized support when you need it most."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Safe and Confidential",
      description: "Your mental health journey is personal. We ensure your data is protected with enterprise-grade security, keeping your thoughts and feelings completely private."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Holistic Approach",
      description: "From daily journaling to AI counseling, we offer a comprehensive suite of tools designed to support your emotional well-being and personal growth."
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Continuous Support",
      description: "Access support 24/7 through our AI counselor, track your mental health progress, and develop healthy coping mechanisms at your own pace."
    }
  ];

  return (
    <PageTransition>
      <div
        className="min-h-screen bg-cover bg-center pt-16"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url("/src/components/images/home.png")',
        }}
      >
        <div className="container mx-auto px-4 py-5">
          
          {/* Show "Back to Home" button only if coming from home page */}
          {isComingFromHome && (
            <Button
              onClick={() => navigate("/")}
              className="fixed top-4 left-4 bg-white/20 text-white px-4 py-2 rounded-lg mb-6 hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="h-5 w-5" /> Back to Home
            </Button>
          )}

          <Card className="backdrop-blur-md bg-white/10 border-white/20 mb-12">
            <CardContent className="p-8 text-center">
              <h1 className="text-4xl font-bold text-white mb-6">Empowering Your Mental Wellness Journey</h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                At MindfulAI, we believe everyone deserves access to mental health support.
                Our platform combines the power of artificial intelligence with proven therapeutic
                approaches to provide personalized, accessible mental health support for all.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-white/10">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/80">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="backdrop-blur-md bg-white/10 border-white/20 mt-12">
            <CardContent className="p-8">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Our Commitment to Mental Health</h2>
                <p className="text-white/80 mb-6">
                  Mental health is just as important as physical health. We're committed to breaking down
                  barriers to mental health support by providing accessible, affordable, and effective
                  tools for emotional well-being. Through our AI-powered platform, we aim to help you
                  understand your emotions better, develop resilience, and create positive mental health habits.
                </p>
                <p className="text-white/80">
                  Whether you're dealing with daily stress, anxiety, or just want to maintain good mental
                  health, our platform is here to support your journey toward emotional well-being.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
