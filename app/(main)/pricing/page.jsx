'use client';
import PricingModel from '../../../components/custom/PricingModel';
import { UserDetailContext } from '../../../context/UserDetailContext';
import Lookup from '../../../data/Lookup';
import React, { useContext } from 'react';

function Pricing() {
  const { userDetail } = useContext(UserDetailContext);
  return (
    <div className=" flex flex-col items-center sm:px-20 md:px-20 w-full ">
    <h2 className="font-bold text-4xl">Pricing</h2>
    <p className="text-gray-400 max-w-xl text-center m-10">
      {Lookup.PRICING_DESC}
    </p>
    <div className="p-5 border rounded-xl w-full flex justify-between items-center sm:mx-10">
      <h2 className="text-lg">
        <span className="font-bold">{userDetail?.token ?? 0}</span> Tokens Left
      </h2>
      <div>
        <h2>Need more token?</h2>
        <p>Upgrade your plane below</p>
      </div>
    </div>
    <PricingModel />
  </div>
  );
}

export default Pricing;
