import { createFileRoute, Link } from '@tanstack/react-router';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/services/store';
import {
  createOrUpdateProfile,
  fetchProfile,
  ProfileData,
} from '@/services/slices/profileSlice';
import { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, isLoading, error } = useSelector(
    (state: RootState) => state.profile
  );

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
    if (user) {
      dispatch(fetchProfile(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (profile) {
      setValue('bio', profile.bio);
      setValue('location', profile.location);
      setValue('pricing', profile.pricing);
      setValue('services', profile.services);
      setValue('availability', profile.availability);
      setValue('contactInfo', profile.contactInfo);
    }
  }, [profile, setValue]);

  const onSubmit = (data: ProfileData) => {
    dispatch(createOrUpdateProfile(data));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user || !profile) return <div>Please log in to view your profile.</div>;

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
          <Card className="m-4">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={profile.user.username} disabled />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.user.email} disabled />
              </div>
              <div>
                <Label htmlFor="userType">User Type</Label>
                <Input id="userType" value={profile.user.userType} disabled />
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
