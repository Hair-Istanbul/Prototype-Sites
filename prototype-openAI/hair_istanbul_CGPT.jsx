/* UNUSED FILE!!!!!!!!! */

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HairIstanbul() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      {/* Navbar */}
      <div className="flex justify-between items-center p-6 border-b border-neutral-800">
        <h1 className="text-xl font-semibold">Hair Istanbul</h1>
        <div className="flex gap-4 items-center">
          <select className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1">
            <option>EN</option>
            <option>TR</option>
            <option>AR</option>
          </select>
          <Button className="bg-white text-black">Book Now</Button>
        </div>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center py-24 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Premium Hair Transplant in Istanbul
        </motion.h2>
        <p className="max-w-2xl text-neutral-400 mb-8">
          A fully Turkish professional team delivering world-class results for
          international patients.
        </p>
        <Button className="bg-white text-black px-6 py-2 rounded-xl">
          Get Consultation
        </Button>
      </div>

      {/* About */}
      <div className="grid md:grid-cols-2 gap-10 px-6 md:px-20 py-16">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Why Hair Istanbul?</h3>
          <p className="text-neutral-400">
            Our clinic is powered by an experienced Turkish medical team
            specializing in modern hair transplant techniques. We combine
            precision, artistry, and care to ensure natural-looking results.
          </p>
        </div>
        <div className="bg-neutral-800 rounded-2xl h-64 flex items-center justify-center text-neutral-500">
          Image Placeholder
        </div>
      </div>

      {/* Before & After */}
      <div className="px-6 md:px-20 py-16">
        <h3 className="text-2xl font-semibold mb-8 text-center">
          Before & After Results
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-neutral-900 border-neutral-800">
              <CardContent className="h-56 flex items-center justify-center text-neutral-500">
                Before / After #{i}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Booking Section (Visual Only) */}
      <div className="px-6 md:px-20 py-16">
        <h3 className="text-2xl font-semibold mb-8 text-center">
          Book Your Appointment
        </h3>
        <div className="max-w-xl mx-auto bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
          <div className="flex flex-col gap-4">
            <input
              placeholder="Full Name"
              className="bg-neutral-800 p-3 rounded"
            />
            <input
              placeholder="Email"
              className="bg-neutral-800 p-3 rounded"
            />
            <input
              placeholder="Phone Number"
              className="bg-neutral-800 p-3 rounded"
            />
            <select className="bg-neutral-800 p-3 rounded">
              <option>Select Service</option>
              <option>Hair Transplant</option>
              <option>Consultation</option>
            </select>
            <Button className="bg-white text-black">
              Submit (Prototype)
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-10 border-t border-neutral-800 text-neutral-500">
        © 2026 Hair Istanbul. All rights reserved.
      </div>
    </div>
  );
}
