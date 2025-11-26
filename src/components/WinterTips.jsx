import { Snowflake, PawPrint, Sun, Droplets } from "lucide-react";


const WinterTips = () => {
    const tips = [
        {
            icon: <Snowflake size={32} />,
            title: "Keep Your Pet Warm Indoors",
            desc: "As temperatures drop, ensure your pet stays cozy indoors. Provide soft blankets, warm bedding, and avoid exposing them to cold floors for long periods.",
        },
        {
            icon: <PawPrint size={32} />,
            title: "Moisturize Paws Regularly",
            desc: "Cold weather can cause cracked paws. Apply pet-safe balms to keep them moisturized and prevent irritation from snow, salt, or ice.",
        },
        {
            icon: <Sun size={32} />,
            title: "Limit Outdoor Time",
            desc: "Shorter walks during extreme cold will reduce the risk of hypothermia, frostbite, and discomfort in your pets. Stay alert to their body language.",
        },
        {
            icon: <Droplets size={32} />,
            title: "Hydrate & Maintain Nutrition",
            desc: "Pets lose moisture faster in winter. Make sure water bowls stay full, and feed a balanced diet to support warmth and immunity.",
        },
    ];
    return (
        (
            <div className="w-full py-6 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-center text-3xl font-bold text-purple-700 mb-6">
                        Winter Care Tips for Pets
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {tips.map((tip, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-md rounded-xl p-6 border hover:shadow-xl transition"
                            >
                                <div className="text-purple-600 mb-4 flex justify-center">
                                    {tip.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                                    {tip.title}
                                </h3>
                                <p className="text-gray-600 text-sm text-center">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    )
}

export default WinterTips;