import { useState } from 'react';

function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { 
      id: 'product-submission', 
      label: 'Product Submission', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      description: 'Add your products' 
    },
    { 
      id: 'my-products', 
      label: 'My Products', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      description: 'View & search inventory' 
    }
  ];

  return (
    <div className="mb-8">
      <div className="glassmorphism rounded-xl bg-white bg-opacity-90 shadow-xl p-2 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 relative flex flex-col items-center py-3 px-4 rounded-lg m-1 transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform -translate-y-1'
                  : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900'
              }`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <div className={`p-2 rounded-full ${activeTab === tab.id ? 'bg-white bg-opacity-20' : 'bg-blue-50'}`}>
                <span className={activeTab === tab.id ? 'text-white' : 'text-blue-600'}>
                  {tab.icon}
                </span>
              </div>
              <div className="mt-2 text-center">
                <div className="font-medium">{tab.label}</div>
                <div className={`text-xs mt-1 ${activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'}`}>{tab.description}</div>
              </div>

              {/* Active indicator */}
              {activeTab === tab.id && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12L0 0H24L12 12Z" fill="#4F46E5" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Path indicator */}
      <div className="max-w-3xl mx-auto mt-4 px-4">
        <div className="text-sm text-gray-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home</span>
          <span className="mx-2">›</span>
          <span className={activeTab === 'product-submission' ? 'font-medium text-blue-600' : 'font-medium text-gray-700'}>
            {activeTab === 'product-submission' ? 'Add New Product' : 'Product Catalog'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Tabs; 