

const WinterTips = () => {
const heroProfiles = [
    {
        name: "Sarah & Winston (Dog)",
        quote: "Adopting Winston filled a huge gap in our lives. He's the most loving, goofy companion we could ask for. Thank you, PawMart!",
        image: "https://i.ibb.co.com/r2scfrfb/doc3.jpg"
    },
    {
        name: "Mark S. & Mittens (Cat)",
        quote: "Mittens is the perfect lap cat and has brought so much peace to our home. The adoption process was smooth and easy.",
        image: "https://i.ibb.co.com/r2scfrfb/doc3.jpg"
    },
    {
        name: "The Chen Family & Zuzu (Rabbit)",
        quote: "Zuzu taught us that all pets deserve a chance. She is playful, cuddly, and now a beloved member of our family.",
        image: "https://i.ibb.co.com/svjkhGBY/doc1.webp"
    },
];
    return (
        (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-12 text-gray-800">
                        <span className="text-orange-500">Meet Our</span> Pet Heroes
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {heroProfiles.map((hero, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-lg flex flex-col items-center border-t-4 border-orange-500">
                                <img
                                    src={hero.image}
                                    alt={`${hero.name} and pet`}
                                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-md mb-4"
                                />
                                <h4 className="text-xl font-bold mb-2 text-gray-700">{hero.name}</h4>
                                <p className="italic text-gray-600">
                                    "{hero.quote}"
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        )
    )
}

export default WinterTips;