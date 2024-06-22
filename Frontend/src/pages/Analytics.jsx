import React from "react";

function Analytics() {
  const metrics = [
    { title: "Total Users", value: "1,234" },
    { title: "Active Users", value: "567" },
    { title: "New Subscriptions", value: "89" },
    { title: "Watch Time (hours)", value: "1234" },
  ];
  const data = [
    { content: "Video 1", views: "1000", likes: "100", comments: "50" },
    { content: "Video 2", views: "750", likes: "75", comments: "30" },
    { content: "Video 3", views: "500", likes: "50", comments: "20" },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Analytics Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.title} className="p-4 bg-white shadow rounded-lg">
            <h3 className="text-lg font-medium">{metric.title}</h3>
            <p className="text-2xl">{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-medium mb-2">User Growth</h3>
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            {/* Replace with actual chart */}
            <p className="text-gray-500">User Growth Chart</p>
          </div>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-medium mb-2">Watch Time</h3>
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            {/* Replace with actual chart */}
            <p className="text-gray-500">Watch Time Chart</p>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">Content Performance</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Content</th>
              <th className="py-2 px-4 border-b">Views</th>
              <th className="py-2 px-4 border-b">Likes</th>
              <th className="py-2 px-4 border-b">Comments</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{item.content}</td>
                <td className="py-2 px-4 border-b">{item.views}</td>
                <td className="py-2 px-4 border-b">{item.likes}</td>
                <td className="py-2 px-4 border-b">{item.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Analytics;
