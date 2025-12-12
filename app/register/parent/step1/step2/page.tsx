"use client";
import { Trash2, Users, Bus, UserPlus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChildrenRegistration() {
  const [children, setChildren] = useState([{ id: 1 }]);
  const router = useRouter();

  const addChild = () => setChildren([...children, { id: children.length + 1 }]);
  const deleteChild = (id: number) => setChildren(children.filter((c) => c.id !== id));

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Children Information</h2>
          <button
            onClick={addChild}
            className="bg-blue-50 text-blue-600 text-sm sm:text-base flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-blue-100 transition"
          >
            <span className="font-bold text-base sm:text-lg">+</span> Add Another Child
          </button>
        </div>

        <form className="flex flex-col gap-5">
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
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 placeholder-gray-400"
                />
                <input
                  type="text"
                  placeholder="Student Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 placeholder-gray-400"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Age"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 placeholder-gray-400"
                  />
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900">
                    <option>Select Bus Stop</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
            <Link href="/register/parent/step1" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-7 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition">
                ← Back
              </button>
            </Link>

            <button
              type="submit"
              className="w-full sm:w-auto px-24 py-3 bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition  shadow-emerald-500/30 hover:shadow-xl hover:shadow-green-500/40"
            >
              ✓ Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
