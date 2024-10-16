import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFieldArray, useForm } from 'react-hook-form';
import { AppDispatch, RootState } from '@/services/store';
import {
  createOrUpdateProfile,
  fetchCurrentUserProfile,
  ProfileData,
} from '@/services/slices/profileSlice';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchCurrentUser } from '@/services/slices/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Route = createFileRoute('/updates')({
  component: Profile,
});

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading: isAuthLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const {
    currentUserProfile,
    isLoading: isProfileLoading,
    error,
  } = useSelector((state: RootState) => state.profile);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { register, handleSubmit, control, setValue, watch } =
    useForm<ProfileData>();
  const {
    fields: availabilityFields,
    append: appendAvailability,
    remove: removeAvailability,
  } = useFieldArray({
    control,
    name: 'availability',
  });

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCurrentUserProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (currentUserProfile) {
      setValue('bio', currentUserProfile.bio || '');
      setValue('location', currentUserProfile.location || '');
      setValue('pricing', currentUserProfile.pricing || '');
      setValue('services', currentUserProfile.services || []);
      setValue('availability', currentUserProfile.availability || []);
      setValue('contactInfo', currentUserProfile.contactInfo || {});
      setValue('profilePicture', currentUserProfile.profilePicture || '');
      setAvatarPreview(currentUserProfile.profilePicture || null);
    }
  }, [currentUserProfile, setValue]);

  const onSubmit = (data: ProfileData) => {
    dispatch(createOrUpdateProfile(data));
  };

  if (isAuthLoading || isProfileLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Please log in to view your profile.</div>;
  if (!currentUserProfile) return <div>No profile found. Please create a profile.</div>;
  return (
    <div className="px-5">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold">Profile Update</h1>
        <Button asChild size={'lg'}>
          <Link to="/">Go Back</Link>
        </Button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 my-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={
                      avatarPreview || currentUserProfile.profilePicture || '/default.png'
                    }
                    alt="Profile picture"
                  />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                {/* <div>
                  <Label>Update Profile Picture</Label>
                  {uploadthingUrl && (
                    <UploadButton
                      endpoint="profilePicture"
                      onClientUploadComplete={(res) => {
                        if (res && res[0]) {
                          setAvatarPreview(res[0].url);
                          setValue('profilePicture', res[0].url);
                        }
                      }}
                      onUploadError={(error: Error) => {
                        console.error(error);
                        alert('Error uploading file');
                      }}
                    />
                  )}
                </div> */}
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={currentUserProfile.user.username} disabled />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={currentUserProfile.user.email} disabled />
              </div>
              <div>
                <Label htmlFor="userType">User Type</Label>
                <Input id="userType" value={currentUserProfile.user.userType} disabled />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" {...register('bio')} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location')} />
              </div>
              <div>
                <Label htmlFor="pricing">Pricing</Label>
                <Input id="pricing" {...register('pricing')} />
              </div>
            </CardContent>
          </Card>

          <Card className="m-4">
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {watch('services')?.map((_service, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input {...register(`services.${index}`)} />
                    <Button
                      type="button"
                      onClick={() => {
                        const services = watch('services');
                        setValue(
                          'services',
                          services.filter((_, i) => i !== index)
                        );
                      }}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => {
                    const services = watch('services') || [];
                    setValue('services', [...services, '']);
                  }}>
                  Add Service
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="m-4">
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              {availabilityFields.map((field, index) => (
                <div key={field.id} className="flex space-x-2 mb-2">
                  <Select
                    onValueChange={(value) =>
                      setValue(`availability.${index}.day`, value)
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    {...register(`availability.${index}.startTime`)}
                    type="time"
                  />
                  <Input
                    {...register(`availability.${index}.endTime`)}
                    type="time"
                  />
                  <Button
                    type="button"
                    onClick={() => removeAvailability(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  appendAvailability({
                    day: '',
                    startTime: '',
                    endTime: '',
                    _id: '',
                  })
                }>
                Add Availability Slot
              </Button>
            </CardContent>
          </Card>

          <Card className="m-4">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('contactInfo.phone')} />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" {...register('contactInfo.website')} />
              </div>
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  {...register('contactInfo.socialMedia.facebook')}
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  {...register('contactInfo.socialMedia.instagram')}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mb-4">
          <Button type="submit" className="w-1/2">
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
