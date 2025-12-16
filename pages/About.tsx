import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-gray-50">
       <div className="bg-brand-dark py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">About Nairobi Premium Motors</h1>
        <p className="text-xl text-gray-300">Driving Kenya Forward Since 2015</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-6">
                Welcome to Nairobi Premium Motors, your number one source for all things cars. We're dedicated to giving you the very best of foreign used and locally used vehicles, with a focus on dependability, customer service, and uniqueness.
            </p>
            <p className="mb-6">
                Founded in 2015, Nairobi Premium Motors has come a long way from its beginnings in a small yard on Ngong Road. When we first started out, our passion for "Clean Cars, Clean Deals" drove us to do intense research on importing quality units from Japan and the UK, and gave us the impetus to turn hard work and inspiration into to a booming online and physical car dealership.
            </p>
            <p className="mb-10">
                We now serve customers all over Kenya, and are thrilled to be a part of the fair-trade wing of the automotive industry.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="mb-8">
                To provide Kenyan car buyers with transparent, safe, and high-quality vehicle options, removing the anxiety often associated with buying used cars.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-brand-red mb-2">Integrity</h3>
                    <p>We do not tamper with mileages. We sell cars as they are, with full disclosure on condition.</p>
                </div>
                <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-brand-red mb-2">Quality</h3>
                    <p>We only stock Grade 4 and above for imports, and strictly vetted locally used units.</p>
                </div>
                <div className="bg-white p-6 rounded shadow-sm">
                    <h3 className="font-bold text-brand-red mb-2">Customer First</h3>
                    <p>We walk with you from selection, to financing, to insurance and after-sales service.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;
