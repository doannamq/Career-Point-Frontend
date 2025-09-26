"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "T1",
    total: 1200,
  },
  {
    name: "T2",
    total: 1400,
  },
  {
    name: "T3",
    total: 1100,
  },
  {
    name: "T4",
    total: 1600,
  },
  {
    name: "T5",
    total: 1800,
  },
  {
    name: "T6",
    total: 1500,
  },
  {
    name: "T7",
    total: 1700,
  },
  {
    name: "T8",
    total: 1900,
  },
  {
    name: "T9",
    total: 1650,
  },
  {
    name: "T10",
    total: 1750,
  },
  {
    name: "T11",
    total: 2000,
  },
  {
    name: "T12",
    total: 2200,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
