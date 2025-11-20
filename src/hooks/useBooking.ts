import { useState } from 'react';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  courseId?: string;
  date?: string;
  time?: string;
  message?: string;
}

interface BookingState {
  formData: BookingFormData;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

const useBooking = () => {
  const [bookingState, setBookingState] = useState<BookingState>({
    formData: {
      name: '',
      email: '',
      phone: '',
      courseId: '',
      date: '',
      time: '',
      message: '',
    },
    isSubmitting: false,
    submitError: null,
    submitSuccess: false,
  });

  const updateFormData = (field: keyof BookingFormData, value: string) => {
    setBookingState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value,
      },
    }));
  };

  const resetForm = () => {
    setBookingState({
      formData: {
        name: '',
        email: '',
        phone: '',
        courseId: '',
        date: '',
        time: '',
        message: '',
      },
      isSubmitting: false,
      submitError: null,
      submitSuccess: false,
    });
  };

  const submitBooking = async () => {
    setBookingState((prev) => ({
      ...prev,
      isSubmitting: true,
      submitError: null,
      submitSuccess: false,
    }));

    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/bookings', { ... });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setBookingState((prev) => ({
        ...prev,
        isSubmitting: false,
        submitSuccess: true,
      }));
    } catch (error) {
      setBookingState((prev) => ({
        ...prev,
        isSubmitting: false,
        submitError: error instanceof Error ? error.message : 'Failed to submit booking',
      }));
    }
  };

  return {
    formData: bookingState.formData,
    isSubmitting: bookingState.isSubmitting,
    submitError: bookingState.submitError,
    submitSuccess: bookingState.submitSuccess,
    updateFormData,
    resetForm,
    submitBooking,
  };
};

export default useBooking;

