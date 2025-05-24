'use client';
import React from 'react';
import { Button } from '../ui/button';
import Colors from '../../../data/Colors';
import Lookup from '../../../data/Lookup';

function PricingModel() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
      {Lookup.PRICING_OPTIONS.map((option) => (
        <div
          key={option.name}
          className="min-w-[270px] max-w-[400px] min-h-[300px] bg-black rounded-2xl p-6 flex flex-col items-start shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-2">{option.name}</h2>
          <p className="text-green-400 font-semibold text-lg mb-1">{option.tokens}</p>
          <p className="text-sm text-gray-400 mb-6">{option.desc}</p>
          <p className="text-3xl font-bold mb-6">
            ${option.price} <span className="text-base font-medium">/month</span>
          </p>
          <Button
            className="w-full"
            style={{
              backgroundColor: Colors.BLUE,
            }}
          >
            Upgrade to {option.name}
          </Button>
        </div>
      ))}
    </div>
  );
}

export default PricingModel;