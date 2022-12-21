import React from "react";

function ProgressBar({ value, maxValue }: { value: number; maxValue: number }) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className='relative w-52 border h-2 sm:h-4 mt-2 mb-2 rounded-md'>
      <div
        style={{ width: `${percentage}%` }}
        className={`${
          percentage < 40 ? "bg-red-500" : "bg-green-500"
        } h-full absolute top-0 left-0 transition-all ease-in-out duration-1000 rounded-md`}
      />
    </div>
  );
}

export default ProgressBar;
