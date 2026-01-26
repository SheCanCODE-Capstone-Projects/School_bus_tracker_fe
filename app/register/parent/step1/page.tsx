"use client";
import React, { useState } from "react";
import { Users, Bus, UserPlus, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ParentRegistration() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    address: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    let newErrors: any = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Home address is required";
    }

    return newErrors;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Store parent data in sessionStorage to pass to step 2
      sessionStorage.setItem('parentRegistrationData', JSON.stringify(formData));
      router.push("/register/parent/step1/step2");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-2xl shadow-lg mb-4">
            <Bus className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            SCHOOL BUS TRACKER
          </h1>

          <h2 className="text-xl font-semibold text-gray-800 mt-2">
            Parent Registration
          </h2>

          <p className="text-gray-600 text-sm">
            Create your account to track your children's bus
          </p>
        </div>

          <div className="flex items-center justify-center gap-6 mb-8">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow">
                <UserPlus className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600">Step 1</p>
                <p className="text-sm text-gray-700 font-medium">
                  Parent Info
                </p>
              </div>
            </div>

            {/* Line */}
            <div className="w-10 h-1 bg-gray-400"></div>

            {/* Step 2 */}
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center shadow">
                <Users className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Step 2</p>
                <p className="text-sm text-gray-500 font-medium">
                  Children Info
                </p>
              </div>
            </div>
          </div>


        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <h3 className="text-xl font-bold text-gray-900">Parent Information</h3>

            {/* FULL NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                  errors.fullName
                    ? "border-red-500 focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                placeholder="+250 788 000 000"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                  errors.phone
                    ? "border-red-500 focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                  errors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a secure password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`w-full px-4 py-3 pr-12 border rounded-xl outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                    errors.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-400"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Home Address *
              </label>
              <textarea
                placeholder="Enter your complete home address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className={`w-full px-4 py-3 h-24 border rounded-xl outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                  errors.address
                    ? "border-red-500 focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                }`}
              ></textarea>
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-2">
  <button
    type="button"
    onClick={() => router.push("/login")}
    className="whitespace-nowrap px-4 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition"
  >
    ← Back to Login
  </button>

  <button
    type="submit"
    className="whitespace-nowrap px-7 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
  >
    Next: Add Children →
  </button>
</div>

          </form>
        </div>
      </div>
    </div>
  );
}