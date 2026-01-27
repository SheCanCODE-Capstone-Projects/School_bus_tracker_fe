"use client";
import { Trash2, Users, Bus, UserPlus } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Child {
  id: number;
  fullName: string;
  studentNumber: string;
  age: string;
  gender: string;
  busStopId: string;
}

export default function ChildrenRegistration() {
  const [children, setChildren] = useState<Child[]>([
    { id: 1, fullName: "", studentNumber: "", age: "", gender: "", busStopId: "" }
  ]);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  // Check if parent data exists
  useEffect(() => {
    const parentData = sessionStorage.getItem('parentRegistrationData');
    if (!parentData) {
      // Redirect back to step 1 if no parent data
      router.push("/register/parent/step1");
    }
  }, [router]);

  const addChild = () => {
    setChildren([
      ...children,
      { id: children.length + 1, fullName: "", studentNumber: "", age: "", gender: "", busStopId: "" }
    ]);
  };

  const deleteChild = (id: number) => {
    if (children.length > 1) {
      setChildren(children.filter((c) => c.id !== id));
    }
  };

  const updateChild = (id: number, field: string, value: string) => {
    setChildren(children.map(child =>
      child.id === id ? { ...child, [field]: value } : child
    ));
  };

  const validateForm = () => {
    let newErrors: any = {};

    children.forEach((child, index) => {
      if (!child.fullName.trim()) {
        newErrors[`child${index}_fullName`] = "Full name is required";
      }
      if (!child.studentNumber.trim()) {
        newErrors[`child${index}_studentNumber`] = "Student number is required";
      }
      if (!child.age.trim()) {
        newErrors[`child${index}_age`] = "Age is required";
      } else if (parseInt(child.age) < 1 || parseInt(child.age) > 25) {
        newErrors[`child${index}_age`] = "Enter a valid age";
      }
      if (!child.gender) {
        newErrors[`child${index}_gender`] = "Gender is required";
      }
      if (!child.busStopId) {
        newErrors[`child${index}_busStopId`] = "Bus stop is required";
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get parent data from sessionStorage
      const parentDataString = sessionStorage.getItem('parentRegistrationData');
      if (!parentDataString) {
        throw new Error("Parent data not found. Please complete step 1 again.");
      }

      const parentData = JSON.parse(parentDataString);
      console.log('Parent data from storage:', parentData);

      // Prepare API payload
      const payload = {
        schoolId: 1,
        name: parentData.fullName,
        email: parentData.email,
        password: parentData.password,
        phone: parentData.phone,
        homeAddress: parentData.address,
        children: children.map(child => ({
          fullName: child.fullName,
          studentNumber: child.studentNumber,
          age: parseInt(child.age),
          gender: child.gender,
          busStopId: parseInt(child.busStopId)
        }))
      };

      console.log('Registration payload:', JSON.stringify(payload, null, 2));

      // Make API call
      const response = await fetch('https://school-bus-tracker-be.onrender.com/api/auth/register/parent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (jsonError) {
        console.error('Failed to parse response as JSON:', jsonError);
        const textResponse = await response.text();
        console.log('Raw response:', textResponse);
        setApiError('Server returned invalid response. Please try again.');
        return;
      }

      if (!response.ok) {
        console.error('Registration failed:', response.status, data);
        if (response.status === 400) {
          setApiError(data.message || 'Invalid registration data. Please check all fields.');
        } else if (response.status === 409) {
          setApiError('Email already exists. Please use a different email.');
        } else {
          setApiError(data.message || 'Registration failed. Please try again.');
        }
        return;
      }

      // Clear sessionStorage
      sessionStorage.removeItem('parentRegistrationData');

      // Redirect to success page or login
      router.replace('/login?registered=true');
      
    } catch (error: unknown) {
      console.error('Registration error details:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        setApiError(error.message);
      } else {
        console.error('Unknown error type:', typeof error, error);
        setApiError('An unexpected error occurred during registration. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center p-4">
      {/* Header */}
      <div className="text-center mt-5">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-2xl shadow-lg mb-4">
          <Bus className="w-12 h-12 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">SCHOOL BUS TRACKER</h1>
        <h2 className="mt-2 text-xl font-semibold text-gray-800">Parent Registration</h2>
        <p className="text-gray-600 text-sm">Create your account to track your children&apos;s bus</p>
      </div>

      {/* Steps */}
      <div className="flex justify-center items-center gap-8 mt-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow">
            <UserPlus className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-blue-600">Step 1</p>
            <p className="text-sm text-gray-700 font-medium">Parent Info</p>
          </div>
        </div>

        <div className="w-10 h-1 bg-blue-500"></div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow">
            <Users className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-blue-600">Step 2</p>
            <p className="text-sm text-gray-700 font-medium">Children Info</p>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white mt-6 p-6 sm:p-8 rounded-3xl shadow-xl w-full max-w-xl">
        {apiError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{apiError}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Children Information</h2>
          <button
            onClick={addChild}
            type="button"
            className="bg-blue-50 text-blue-600 text-sm sm:text-base flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-blue-100 transition"
          >
            <span className="font-bold text-base sm:text-lg">+</span> Add Another Child
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {children.map((child, index) => (
            <div key={child.id} className="bg-gray-50 p-4 rounded-2xl shadow-sm relative">
              {children.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteChild(child.id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-600 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}

              <h3 className="text-sm font-medium text-gray-700 mb-2">Child {index + 1}</h3>

              <div className="flex flex-col gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={child.fullName}
                    onChange={(e) => updateChild(child.id, 'fullName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 transition text-gray-900 placeholder-gray-400 ${
                      errors[`child${index}_fullName`] 
                        ? 'border-red-500 focus:ring-red-400' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors[`child${index}_fullName`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`child${index}_fullName`]}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Student Number"
                    value={child.studentNumber}
                    onChange={(e) => updateChild(child.id, 'studentNumber', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 transition text-gray-900 placeholder-gray-400 ${
                      errors[`child${index}_studentNumber`] 
                        ? 'border-red-500 focus:ring-red-400' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors[`child${index}_studentNumber`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`child${index}_studentNumber`]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Age"
                      value={child.age}
                      onChange={(e) => updateChild(child.id, 'age', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 transition text-gray-900 placeholder-gray-400 ${
                        errors[`child${index}_age`] 
                          ? 'border-red-500 focus:ring-red-400' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {errors[`child${index}_age`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`child${index}_age`]}</p>
                    )}
                  </div>

                  <div>
                    <select 
                      value={child.gender}
                      onChange={(e) => updateChild(child.id, 'gender', e.target.value)}
                      className={`w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base ${
                        errors[`child${index}_gender`] 
                          ? 'border-red-500 focus:ring-red-400' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    >
                      <option value="" className="text-xs sm:text-sm md:text-base truncate">Select Gender</option>
                      <option value="male" className="text-xs sm:text-sm md:text-base truncate">Male</option>
                      <option value="female" className="text-xs sm:text-sm md:text-base truncate">Female</option>
                    </select>
                    {errors[`child${index}_gender`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`child${index}_gender`]}</p>
                    )}
                  </div>
                </div>

                <div>
                  <select 
                    value={child.busStopId}
                    onChange={(e) => updateChild(child.id, 'busStopId', e.target.value)}
                    className={`w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base ${
                      errors[`child${index}_busStopId`] 
                        ? 'border-red-500 focus:ring-red-400' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="" className="text-xs sm:text-sm md:text-base truncate">Select Bus Stop</option>
                    <option value="1" className="text-xs sm:text-sm md:text-base truncate">Main Street Stop</option>
                    <option value="2" className="text-xs sm:text-sm md:text-base truncate">School Gate Stop</option>
                    <option value="3" className="text-xs sm:text-sm md:text-base truncate">Park Avenue Stop</option>
                  </select>
                  {errors[`child${index}_busStopId`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`child${index}_busStopId`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
            <Link href="/register/parent/step1" className="w-full sm:w-auto">
              <button 
                type="button"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition disabled:opacity-50"
              >
                ← Back
              </button>
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-24 py-3 bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-emerald-500/30 hover:shadow-xl hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Submitting...
                </>
              ) : (
                <>✓ Complete Registration</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}