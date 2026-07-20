import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';

const Sliders = () => {
    const slidesData = [
        {
            image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1600&q=80',
            tagline: 'Find your perfect furry companion',
            subtext: 'Friendly pets are waiting to meet their new family.',
        },
        {
            image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=80',
            tagline: 'Adopt, don’t shop',
            subtext: 'Give a pet a safe and loving home today.',
        },
        {
            image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1600&q=80',
            tagline: 'Every pet deserves love and care',
            subtext: 'Discover trusted services and warm support for your best friend.',
        },
    ];

    return (
        <div className="hidden h-[460px] w-full lg:block">
            <Swiper
                navigation={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                modules={[Navigation, Autoplay]}
                className="h-full w-full"
            >
                {slidesData.map((slide, index) => (
                    <SwiperSlide key={index} className="relative h-full w-full">
                        <img
                            className="h-full w-full object-cover"
                            src={slide.image}
                            alt={slide.tagline}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-center items-start p-8 text-white md:p-16 lg:max-w-3xl lg:mx-auto">
                            <span className="mb-3 inline-flex w-fit rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] backdrop-blur-sm">
                                PawMart essentials
                            </span>
                            <h1 className="text-4xl font-extrabold leading-tight drop-shadow-lg md:text-5xl lg:text-6xl">
                                {slide.tagline}
                            </h1>
                            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-100 sm:text-base">
                                {slide.subtext}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <span className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                                    Trusted services
                                </span>
                                <span className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                                    Caring community
                                </span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Sliders;