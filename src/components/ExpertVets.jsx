import React from 'react';

const ExpertVets = () => {
    const vets = [
        {
            name: "Dr. Alicia Snow",
            specialty: "Winter Dermatology & Paw Care",
            exp: "8 Years Exp.",
            img: "https://i.ibb.co.com/svjkhGBY/doc1.webp", 
        },
        {
            name: "Dr. Kevin Frost",
            specialty: "Cold Weather Nutrition",
            exp: "6 Years Exp.",
            img: "https://i.ibb.co.com/CKXNSjnf/doc2.webp", 
        },
        {
            name: "Dr. Scarlett Pine",
            specialty: "Pet Allergies & Dry Skin",
            exp: "5 Years Exp.",
            img: "https://i.ibb.co.com/r2scfrfb/doc3.jpg", 
        },
    ];
    return (
        <section className="w-full py-4 bg-white">
            <div className="max-w-7xl mx-auto px-4">

                <h2 className="text-center text-3xl font-bold text-purple-700 mb-6">
                    Meet Our Expert Vets
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {vets.map((vet, i) => (
                        <div
                            key={i}
                            className="bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-xl transition"
                        >
                            <img
                                src={vet.img}
                                alt={vet.name}
                                className="w-full h-56 object-cover"
                            />

                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-purple-700">
                                    {vet.name}
                                </h3>

                                <p className="text-gray-600 mt-1">{vet.specialty}</p>

                                <p className="text-gray-500 text-sm mt-1">{vet.exp}</p>

                                <button className="w-full mt-5 bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 transition">
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ExpertVets;