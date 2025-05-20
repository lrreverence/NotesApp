import React from 'react';
import Navbar from '../../components/NavBar/Navbar';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  // Format the join date to be more readable
  const formatJoinDate = (date) => {
    if (!date) return 'Recently';
    return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            {/* Profile Header */}
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex items-center">
                {user?.avatar ? (
                  <img
                    className="h-16 w-16 rounded-full"
                    src={user.avatar}
                    alt=""
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-medium">
                    {(user?.fullName || user?.name || '?')[0].toUpperCase()}
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{user?.fullName || user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-sm text-gray-500">Member since {formatJoinDate(user?.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Notes</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{user?.totalNotes || 0}</dd>
                  </div>
                </div>
                {/* Add more stats cards here */}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
              <div className="mt-4 flow-root">
                <ul className="-mb-8">
                  {user?.recentActivity?.map((activity, index) => (
                    <li key={index}>
                      <div className="relative pb-8">
                        {index !== user.recentActivity.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <svg
                                className="h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {activity.type} note: <span className="font-medium text-gray-900">{activity.note}</span>
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time dateTime={activity.time}>{activity.time}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 