import React from "react";

interface ChartItemProps {
  label: string;
  percentage: number;
  color: string;
}

const ChartItem: React.FC<ChartItemProps> = ({ label, percentage, color }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full ${color} mr-2`}></span>
          <span className="text-sm text-gray-500">{label}</span>
        </div>
        <span className="text-sm font-medium text-gray-900">{percentage}%</span>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

interface ChartSectionProps {
  title: string;
  data: {
    label: string;
    percentage: number;
    color: string;
  }[];
}

const ChartSection: React.FC<ChartSectionProps> = ({ title, data }) => {
  return (
    <div>
      <h4 className="text-base font-medium text-gray-500 mb-4">{title}</h4>
      <div className="space-y-4">
        {data.map((item, index) => (
          <ChartItem
            key={index}
            label={item.label}
            percentage={item.percentage}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
};

const TagDistributionChart: React.FC = () => {
  const brandData = [
    { label: "Disney", percentage: 45, color: "bg-[#0063e5]" },
    { label: "Marvel", percentage: 25, color: "bg-red-600" },
    { label: "Star Wars", percentage: 15, color: "bg-yellow-400" },
    { label: "Pixar", percentage: 10, color: "bg-blue-400" },
    { label: "National Geographic", percentage: 5, color: "bg-green-500" },
  ];

  const availabilityData = [
    { label: "Standard", percentage: 70, color: "bg-purple-600" },
    { label: "New Arrival", percentage: 15, color: "bg-green-500" },
    { label: "Leaving Soon", percentage: 8, color: "bg-red-500" },
    { label: "Exclusive", percentage: 7, color: "bg-blue-500" },
  ];

  const categoryData = [
    { label: "Family", percentage: 40, color: "bg-indigo-500" },
    { label: "Action", percentage: 30, color: "bg-orange-500" },
    { label: "Documentary", percentage: 15, color: "bg-teal-500" },
    { label: "Drama", percentage: 10, color: "bg-pink-500" },
    { label: "Other", percentage: 5, color: "bg-gray-500" },
  ];

  return (
    <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Tag Distribution</h3>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ChartSection title="Brand Tags" data={brandData} />
          <ChartSection title="Availability Tags" data={availabilityData} />
          <ChartSection title="Content Categories" data={categoryData} />
        </div>
      </div>
    </div>
  );
};

export default TagDistributionChart;
