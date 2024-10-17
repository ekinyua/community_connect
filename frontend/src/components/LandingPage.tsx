import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Star, Search, Building, Palette, LogOut, User } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { authApi } from '@/services/api';
import { ModeToggle } from './mode-toggle';
import { AppDispatch } from '@/services/store';
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from '@/services/slices/profileSlice';

interface Availability {
  day: string;
  startTime: string;
  endTime: string;
  _id: string;
}

interface Profile {
  _id: string;
  user: {
    _id: string;
    username: string;
    userType: 'consumer' | 'business' | 'artisan';
  };
  bio: string;
  profilePicture: string;
  services: string[];
  rating?: number;
  location?: string;
  availability?: Availability[];
}

const LandingPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchParams, setSearchParams] = useState({
    service: '',
    type: 'all',
    location: '',
    availability: '',
  });
  const [currentUser, setCurrentUser] = useState<any>(null);

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

  const fetchProfiles = async (params = searchParams) => {
    try {
      const response = await axios.get('/api/profiles/search', { params });
      setProfiles(response.data.profiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfiles();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTypeChange = (value: string) => {
    const newParams = { ...searchParams, type: value };
    setSearchParams(newParams);
    fetchProfiles(newParams);
  };

  const handleProfileClick = (userId: string) => {
    console.log('LandingPage: Clicked user ID:', userId);
    dispatch(fetchUserProfile(userId));
    navigate({
      to: '/profile/$userId',
      params: { userId },
    });
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
    navigate({ to: '/updates' });
  };

  const formatAvailability = (availability: Availability[]) => {
    return availability
      .map((slot) => `${slot.day} ${slot.startTime}-${slot.endTime}`)
      .join(', ');
  };

  if (!currentUser) {
    return null; // or a loading spinner
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Welcome to Community Connect</h1>
        <div className="flex gap-4">
          <Button asChild>
            <ModeToggle />
          </Button>
          <Button onClick={handleNavigateToProfile} variant="outline">
            <User className="mr-2 h-4 w-4" /> Profile
          </Button>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          type="text"
          name="service"
          placeholder="Search for services..."
          value={searchParams.service}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name="location"
          placeholder="Location"
          value={searchParams.location}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name="availability"
          placeholder="Availability (e.g., Monday)"
          value={searchParams.availability}
          onChange={handleInputChange}
        />
        <Button type="submit" className="w-full">
          <Search className="mr-2 h-5 w-5" /> Search
        </Button>
      </form>

      <Tabs
        value={searchParams.type}
        onValueChange={handleTypeChange}
        className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="business">Businesses</TabsTrigger>
          <TabsTrigger value="artisan">Artisans</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {profiles.map((profile) => (
          <Card
            key={profile._id}
            className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={profile.profilePicture || '/default.png'}
                alt={profile.user.username}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/default.png';
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
              <h2 className="text-xl font-semibold mb-1">
                {profile.user.username}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {profile.services.join(', ')}
              </p>
              <p className="text-sm line-clamp-2">{profile.bio}</p>
              {profile.location && (
                <p className="text-sm mt-1">📍 {profile.location}</p>
              )}
              {profile.availability && profile.availability.length > 0 && (
                <p className="text-sm mt-1 line-clamp-2">
                  🕒 {formatAvailability(profile.availability)}
                </p>
              )}
            </CardContent>
            <CardFooter className="justify-between">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span>{profile.rating ? profile.rating.toFixed(1) : 'N/A'}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProfileClick(profile.user._id)}>
                View Profile
              </Button>
              <Button variant={'outline'} asChild>
                <Link to="/chats">Chat</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {profiles.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No profiles found. Try different search parameters.
        </p>
      )}
    </div>
  );
};

export default LandingPage;
