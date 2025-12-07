import { Swiper, SwiperSlide } from 'swiper/react';
import img1 from '../assets/2 (1).png'
import img2 from '../assets/3 (1).png'
import img3 from '../assets/dog-1.png'

import 'swiper/css';
import 'swiper/css/navigation';

import { Autoplay, Navigation } from 'swiper/modules';

const Sliders = () => {
    const slidesData = [
        {
            image: img1,
            tagline: "Find Your Furry Friend Today!",

        },
        {
            image: img2,
            tagline: "Adopt, Don’t Shop — Give a Pet a Home.",

        },
        {
            image: img3,
            tagline: "Because Every Pet Deserves Love and Care.",

        },
    ];
    return (
        <div className="hidden lg:block h-[400px] w-full">
            <Swiper
                navigation={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                modules={[Navigation, Autoplay]}
                className="h-full w-full"
            >
                {slidesData.map((slide, index) => (
                    <SwiperSlide key={index} className="h-full w-full relative">

                        <img
                            className="w-full h-full object-cover"
                            src={slide.image}
                        />


                        <div className="absolute inset-0 bg-black opacity-40"></div>


                        <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 text-white max-w-4xl mx-auto">
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight">
                                {slide.tagline}
                            </h1>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

    );
};

export default Sliders;