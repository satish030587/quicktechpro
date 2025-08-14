interface Package {
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface PricingTableProps {
  packages: Package[];
}

export default function PricingTable({ packages }: PricingTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {packages.map((pkg, index) => (
        <div
          key={index}
          className={`relative bg-white rounded-2xl shadow-lg p-8 ${
            pkg.popular ? 'ring-2 ring-blue-500 scale-105' : ''
          }`}
        >
          {pkg.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
          )}

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
            <div className="text-4xl font-bold text-blue-600 mb-2">{pkg.price}</div>
            <div className="text-gray-600 mb-4">{pkg.duration}</div>
            <p className="text-gray-700">{pkg.description}</p>
          </div>

          <ul className="space-y-3 mb-8">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
              pkg.popular
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            Choose {pkg.name}
          </button>
        </div>
      ))}
    </div>
  );
}
