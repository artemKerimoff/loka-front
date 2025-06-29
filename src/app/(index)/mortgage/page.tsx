"use client";

import React, { useState, useEffect } from "react";

const programs = ["Базовая", "С детьми", "IT-ипотека", "Дальневосточная"];

const programRates: { [key: string]: number } = {
  "Базовая": 23,
  "С детьми": 7,
  "IT-ипотека": 6,
  "Дальневосточная": 3,
};

// Helper to format numbers with spaces
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function MortgageCalculatorPage() {
  const [propertyValue, setPropertyValue] = useState<number>(12205000);
  const [downPayment, setDownPayment] = useState<number>(5600000);
  const [loanTerm, setLoanTerm] = useState<number>(3);
  const [interestRate, setInterestRate] = useState<number>(programRates["Базовая"]);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [activeProgram, setActiveProgram] = useState("Базовая");

  const loanAmount = propertyValue - downPayment;

  useEffect(() => {
    setInterestRate(programRates[activeProgram]);
  }, [activeProgram]);

  useEffect(() => {
    calculateMonthlyPayment();
  }, [propertyValue, downPayment, loanTerm, interestRate]);

  const calculateMonthlyPayment = () => {
    if (loanAmount <= 0) {
      setMonthlyPayment(0);
      return;
    }
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    if (monthlyRate > 0) {
      const payment =
        (loanAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
      setMonthlyPayment(payment);
    } else {
      setMonthlyPayment(loanAmount / numberOfPayments);
    }
  };

  return (
    <main className="container mx-auto my-8">
      <h1 className="text-4xl md:text-6xl font-light mb-8">
        <span className="text-[#E88246]">Ипотечный</span> калькулятор
      </h1>

      <div className="bg-[#F9F5EF] p-4 sm:p-8 rounded-2xl">
        <div className="flex flex-wrap gap-2 mb-8">
          {programs.map((program) => (
            <button
              key={program}
              onClick={() => setActiveProgram(program)}
              className={`px-4 py-2 rounded-lg text-sm sm:text-base transition-colors ${
                activeProgram === program
                  ? "bg-white text-[#E88246] border border-[#E88246]"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}>
              {program}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="space-y-6">
            {/* Property Value */}
            <div>
              <label className="block text-gray-700 mb-2">
                Стоимость недвижимости
              </label>
              <div className="bg-white p-3 rounded-lg font-bold text-lg text-[#E88246]">
                {formatNumber(propertyValue)} ₽
              </div>
              <input
                type="range"
                min="1500000"
                max="100000000"
                step="50000"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E88246] mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1,5 млн ₽</span>
                <span>100 млн ₽</span>
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <label className="block text-gray-700 mb-2">
                Первоначальный взнос
              </label>
              <div className="bg-white p-3 rounded-lg font-bold text-lg text-[#E88246]">
                {formatNumber(downPayment)} ₽
              </div>
              <input
                type="range"
                min="500000"
                max={propertyValue * 0.9} // Max 90% of property value
                step="50000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E88246] mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>500 тыс ₽</span>
                <span>{formatNumber(Math.floor(propertyValue * 0.9))} ₽</span>
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-gray-700 mb-2">Срок кредита</label>
              <div className="bg-white p-3 rounded-lg font-bold text-lg text-[#E88246]">
                {loanTerm}{" "}
                {loanTerm === 1 ? "год" : loanTerm > 4 ? "лет" : "года"}
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E88246] mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 год</span>
                <span>30 лет</span>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="bg-white p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <p className="text-gray-500">Ежемесячный платеж</p>
                <p className="text-4xl sm:text-5xl font-bold text-[#E88246]">
                  {monthlyPayment !== null
                    ? formatNumber(Math.round(monthlyPayment))
                    : 0}{" "}
                  ₽
                </p>
              </div>
              <div className="mb-6">
                <p className="text-gray-500">Процентная ставка</p>
                <p className="text-3xl font-bold text-gray-800">
                  {interestRate} %
                </p>
              </div>
              <div className="mb-6">
                <p className="text-gray-500">Сумма кредита</p>
                <p className="text-3xl font-bold text-gray-800">
                  {formatNumber(loanAmount)} ₽
                </p>
              </div>
            </div>
            <button className="w-full bg-[#E88246] text-white font-semibold px-6 py-4 rounded-lg hover:bg-orange-600 transition-colors text-lg">
              Подать заявку
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
