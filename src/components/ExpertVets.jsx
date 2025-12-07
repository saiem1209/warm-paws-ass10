import React from 'react';

const ExpertVets = () => {
    const benefits = [
        {
            icon: '💖', 
            title: 'Ethical Choice',
            description: 'Fight animal overpopulation and reduce the demand for puppy mills and unethical breeders.',
        },
        {
            icon: '✅', 
            title: 'Health Assured',
            description: 'Pets are typically spayed/neutered, vaccinated, and microchipped before going to their new home.',
        },
        {
            icon: '🧠', 
            title: 'Know Their History',
            description: 'Our team knows the pet\'s personality, temperament, and specific needs for a perfect match.',
        },
    ];
    return (
        <section className="py-16 bg-gray-50 mt-5">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-4 text-gray-800">
                    <span className="text-orange-500">Why Adopt</span> from PawMart?
                </h2>

                <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-12">
                    Every year, millions of wonderful, loving pets end up in shelters through no fault of their own. By choosing adoption, you give a deserving animal a second chance at life. **Adoption saves lives.**
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <span className="text-4xl block mb-4">{benefit.icon}</span>
                            <h3 className="text-xl font-semibold mb-3 text-gray-700">{benefit.title}</h3>
                            <p className="text-gray-500">{benefit.description}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ExpertVets;