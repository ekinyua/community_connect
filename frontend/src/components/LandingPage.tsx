import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, Search, Building, Palette, LogOut, User } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from 'axios';
import { authApi } from '@/services/api';

interface Profile {
  _id: string;
  user: {
    username: string;
    userType: 'consumer' | 'business' | 'artisan';
  };
  bio: string;
  profilePicture: string;
  services: string[];
  rating?: number;
}

const LandingPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'business' | 'artisan'>('all');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchProfiles();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await authApi.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Authentication error:', error);
      navigate({ to: '/login' });
    }
  };

  const fetchProfiles = async (search: string = '') => {
    try {
      const response = await axios.get('/api/profiles/search', {
        params: { service: search }
      });
      setProfiles(response.data.profiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfiles(searchTerm);
  };

  const handleProfileClick = (profileId: string) => {
    navigate({ to: '/profile', params: { userId: profileId } });
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate({ to: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigateToProfile = () => {
    navigate({ to: '/profile' });
  };

  const filteredProfiles = profiles.filter(profile => 
    activeTab === 'all' || profile.user.userType === activeTab
  );

  if (!currentUser) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Welcome to Community Connect</h1>
        <div className="flex gap-4">
          <Button onClick={handleNavigateToProfile} variant="outline">
            <User className="mr-2 h-4 w-4" /> Profile
          </Button>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSearch} className="mb-8 relative">
        <Input
          type="text"
          placeholder="Search for services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
        <Button type="submit" variant="ghost" className="absolute right-0 top-0 h-full">
          <Search className="h-5 w-5" />
        </Button>
      </form>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'business' | 'artisan')} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="business">Businesses</TabsTrigger>
          <TabsTrigger value="artisan">Artisans</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProfiles.map((profile) => (
          <Card key={profile._id} className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden" onClick={() => handleProfileClick(profile._id)}>
            <div className="aspect-video relative">
              <img
                src={profile.profilePicture || "/default.png"}
                alt={profile.user.username}
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/default.png";
                }}
              />
              <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                {profile.user.userType === 'business' ? (
                  <Building className="h-5 w-5 text-blue-500" />
                ) : profile.user.userType === 'artisan' ? (
                  <Palette className="h-5 w-5 text-purple-500" />
                ) : null}
              </div>
            </div>
            <CardContent className="pt-4">
              <h2 className="text-xl font-semibold mb-1">{profile.user.username}</h2>
              <p className="text-sm text-gray-500 mb-2">{profile.services.join(', ')}</p>
              <p className="text-sm line-clamp-2">{profile.bio}</p>
            </CardContent>
            <CardFooter className="justify-between">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span>{profile.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              <Button variant="outline" size="sm">View Profile</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredProfiles.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No profiles found. Try a different search term or category.</p>
      )}
    </div>
  );
};

export default LandingPage;