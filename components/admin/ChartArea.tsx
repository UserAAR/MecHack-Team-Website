"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ComponentType } from "react";

type Props = {
  data: { name: string; value: number }[];
};

const AreaC = Area as unknown as ComponentType<any>;
const AreaChartC = AreaChart as unknown as ComponentType<any>;
const CartesianGridC = CartesianGrid as unknown as ComponentType<any>;
const ResponsiveContainerC = ResponsiveContainer as unknown as ComponentType<any>;
const TooltipC = Tooltip as unknown as ComponentType<any>;
const XAxisC = XAxis as unknown as ComponentType<any>;
const YAxisC = YAxis as unknown as ComponentType<any>;

export function ChartArea({ data }: Props) {
  return (
    <div className="w-full h-64 rounded-xl border bg-white/70 p-3">
      <ResponsiveContainerC width="100%" height="100%">
        <AreaChartC data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e38d1a" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#e38d1a" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGridC strokeDasharray="3 3" stroke="#00000010" />
          <XAxisC dataKey="name" stroke="#000080" tickLine={false} axisLine={false} />
          <YAxisC stroke="#000080" tickLine={false} axisLine={false} />
          <TooltipC cursor={{ stroke: "#000080", strokeWidth: 1 }} />
          <AreaC type="monotone" dataKey="value" stroke="#e38d1a" fillOpacity={1} fill="url(#colorPrimary)" />
        </AreaChartC>
      </ResponsiveContainerC>
    </div>
  );
} 