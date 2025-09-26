"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface StepIndicatorsProps {
  currentStep: number;
}

export default function StepIndicators({ currentStep }: StepIndicatorsProps) {
  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Description" },
    { number: 3, title: "Review" },
  ];

  return (
    <div className="flex items-center justify-center mb-10">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{
                scale: currentStep >= step.number ? 1 : 0.9,
                opacity: currentStep >= step.number ? 1 : 0.8,
              }}
              whileHover={{ scale: 1.05 }}
              className={`flex flex-col items-center`}>
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-full 
                  ${
                    currentStep >= step.number
                      ? "bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-md shadow-blue-200/50"
                      : "bg-muted text-muted-foreground"
                  } transition-all duration-300`}>
                {currentStep > step.number ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-lg font-medium">{step.number}</span>}
              </div>
              <span className={`text-xs mt-2 font-medium ${currentStep >= step.number ? "text-blue-600" : "text-muted-foreground"}`}>
                {step.title}
              </span>
            </motion.div>
            {index < steps.length - 1 && (
              <div
                className={`w-20 h-1 mx-1 rounded-full transition-all duration-500 ${
                  currentStep > step.number ? "bg-gradient-to-r from-blue-600 to-green-500" : "bg-muted"
                }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
