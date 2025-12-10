"use client";
import { Trash2, Users, Bus, UserPlus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function ChildrenRegistration() {
  const [children, setChildren] = useState([{ id: 1 }]);

  const addChild = () => {
    setChildren([...children, { id: children.length + 1 }]);
  };

  const deleteChild = (id: number) => {
    setChildren(children.filter((child) => child.id !== id));
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="text-center mt-5">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-2xl shadow-lg mb-4">
          <Bus className="w-12 h-12 text-white" strokeWidth={2.5} />
        </div>

        <h1 className="mt-3 text-2xl text-black font-semibold">
          Parent Registration
        </h1>
        <p className="text-gray-500 text-sm">
          Create your account to track your children's bus
        </p>
      </div>
      <div className="flex justify-center items-center gap-8 mt-5">
        <div className="flex items-center gap-3">
          {/* Circle */}
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <UserPlus className="text-white w-5 h-5" />
          </div>

          {/* Right side: Step 1 + Parent Info */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-blue-600">Step 1</p>
            <p className="text-sm text-gray-600 font-medium">Parent Info</p>
          </div>
        </div>

        <div className="w-10 h-1 mb-4 bg-blue-500"></div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Users className="text-white w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <p className="text-xs font-semibold text-blue-600">Step 2</p>
            <p className="text-sm text-gray-600 font-medium">Children Info</p>
          </div>
        </div>
      </div>

<div className="bg-white mt-8 mx-auto p-5 rounded-lg max-w-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-black">
            Children Information
          </h2>
          <button
            className="bg-blue-100 text-blue-600 text-sm flex items-center gap-1 px-3 py-2 rounded-md"
            type="button"
            onClick={addChild}
          >
            <span className="text-lg font-bold">+</span> Add Another Child
          </button>
        </div>

        <form className="flex flex-col gap-4">
          {children.map((child, index) => (
            <div
              key={child.id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm relative"
            >
              {children.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteChild(child.id)}
                  className="absolute top-3 right-3 text-red-500 text-xl"
                >
                  <Trash2 />
                </button>
              )}

              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Child {index + 1}
              </h3>

              <div className="mb-3">
                <label className="text-sm text-gray-700">Full Name *</label>
                <input
                  type="text"
                  placeholder="Child's full name"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md placeholder-gray-400"
                />
              </div>

              <div className="mb-3">
                <label className="text-sm text-gray-700">
                  Student Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g., STU12345"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Age *</label>
                  <input
                    type="number"
                    placeholder="Age"
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md placeholder-gray-400 text-gray-700"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Bus Stop *</label>
                  <select className="w-full p-2 mt-1 border border-gray-300 rounded-md text-gray-700">
                    <option>Select bus stop</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between text-black mt-3">
            <Link href="/register/parent/step1">
              <button
                type="button"
                className="px-10 py-2 border border-gray-300 rounded-full"
              >
                ← Back
              </button>
            </Link>
            <button
              type="submit"
              className="px-25 py-2 bg-green-600 text-white rounded-full flex items-center gap-2"
            >
              ✓ Complete Registration
            </button>
          </div>
        </form>
      </div>


      
    </div>
  );
}


