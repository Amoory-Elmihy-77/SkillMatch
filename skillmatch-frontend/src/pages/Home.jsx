import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import OpportunityCard from "../components/OpportunityCard";
import {
  Search,
  ArrowRight,
  Briefcase,
  BookOpen,
  Users,
  Shield,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import Loader from "../components/Loader";
import heroImage from "../assets/hero-workspace.png";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [stats, setStats] = useState({
    applied: 0,
    saved: 0,
    views: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      setStats({
        applied: 0,
        saved: user?.savedOpportunities?.length || 0,
        views: 0,
        completed: 0,
      });

      const response = await api.get("/opportunities/recommended");

      const opportunities =
        response.data.data?.recommendedOpportunities ||
        response.data.data?.opportunities ||
        [];

      setRecommended(opportunities.slice(0, 4));
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Failed to fetch dashboard data", error);
        console.error("Error details:", error.response?.data);
      }
      setRecommended([]);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || "User"}!
              </h1>
              <p className="text-gray-600 mt-1">
                Discover new opportunities and advance your creative career.
              </p>
            </div>
            <div className="bg-primary-50 p-4 rounded-xl flex items-center gap-4 w-full md:w-auto">
              <div className="p-2 bg-white rounded-lg text-primary-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Update Your Skills
                </h3>
                <p className="text-xs text-gray-500">
                  Enhance recommendations by refining your profile.
                </p>
              </div>
              <Link
                to="/me"
                className="ml-auto text-sm font-bold text-primary-600 hover:text-primary-700"
              >
                Go
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Quick Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-purple-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">
                  Applied Jobs
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.applied}
              </p>
            </div>
            <div className="bg-indigo-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-900">
                  Saved Courses
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.saved}</p>
            </div>
            <div className="bg-orange-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">
                  Profile Views
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.views}</p>
            </div>
            <div className="bg-teal-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-medium text-teal-900">
                  Completed Projects
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.completed}
              </p>
            </div>
          </div>

          {/* Recommended Opportunities */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Top Recommended Opportunities
            </h2>
            {loading ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommended.map((opp) => (
                  <OpportunityCard key={opp._id} opportunity={opp} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Landing Page for Guests
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Creative Workspace"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-purple-900/90 mix-blend-multiply"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Discover Opportunities That Match <br /> Your Skills
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-200 mb-10">
            SkillMatch connects creative professionals with freelance jobs,
            courses, and tools to elevate their careers.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-full text-primary-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 shadow-lg transition-transform transform hover:scale-105"
            >
              Join Now
            </Link>
            <Link
              to="/opportunities"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-500/20 hover:bg-primary-500/30 md:py-4 md:text-lg md:px-10 backdrop-blur-sm transition-transform transform hover:scale-105"
            >
              Find Opportunities
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Unlock Your Creative Potential
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Search,
                title: "Smart Job Matching",
                desc: "Our AI-powered engine connects you with opportunities that fit your unique skills.",
              },
              {
                icon: TrendingUp,
                title: "Skill Enhancement",
                desc: "Access curated courses and resources to upskill and grow your career.",
              },
              {
                icon: Briefcase,
                title: "Portfolio Showcase",
                desc: "Build a stunning portfolio that highlights your best work and attracts clients.",
              },
              {
                icon: Users,
                title: "Community & Support",
                desc: "Join a vibrant network of creative professionals to collaborate and support.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">
              How SkillMatch Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              {
                step: 1,
                title: "Create Your Profile",
                desc: "Showcase your skills, experience, and portfolio to attract the right opportunities.",
              },
              {
                step: 2,
                title: "Discover Opportunities",
                desc: "Browse personalized job listings, courses, and tools matched to your profile.",
              },
              {
                step: 3,
                title: "Grow Your Career",
                desc: "Apply with confidence, collaborate, and achieve your professional goals.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold border-2 border-primary-100">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join SkillMatch today and unlock a world of opportunities tailored
            just for you.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
