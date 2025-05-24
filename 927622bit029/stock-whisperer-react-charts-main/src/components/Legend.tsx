
import React from 'react';

const Legend: React.FC = () => {
  const legendItems = [
    { label: 'Strong Negative', color: 'rgba(239, 68, 68, 1)', range: '-1.0 to -0.7' },
    { label: 'Moderate Negative', color: 'rgba(239, 68, 68, 0.6)', range: '-0.7 to -0.3' },
    { label: 'Weak Negative', color: 'rgba(239, 68, 68, 0.3)', range: '-0.3 to 0.0' },
    { label: 'Neutral', color: 'rgba(156, 163, 175, 0.3)', range: '0.0' },
    { label: 'Weak Positive', color: 'rgba(34, 197, 94, 0.3)', range: '0.0 to 0.3' },
    { label: 'Moderate Positive', color: 'rgba(34, 197, 94, 0.6)', range: '0.3 to 0.7' },
    { label: 'Strong Positive', color: 'rgba(34, 197, 94, 1)', range: '0.7 to 1.0' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Correlation Legend
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-900">{item.label}</div>
              <div className="text-xs text-gray-500">{item.range}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Click on any cell in the heatmap to see detailed statistics for the correlation between two stocks.
        </p>
      </div>
    </div>
  );
};

export default Legend;
