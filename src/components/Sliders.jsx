import { Swiper, SwiperSlide } from 'swiper/react';
import img1 from '../assets/2 (1).png'
import img2 from '../assets/3 (1).png'
import img3 from '../assets/dog-1.png'

import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';

const Sliders = () => {
    return (
        <div className="h-[400px] w-full">
            <Swiper
                navigation={true}
                modules={[Navigation]}
                className="h-full w-full"
            >
                <SwiperSlide className="h-full w-full flex">
                    <img className="w-full h-full object-cover" src={img1} alt="" />
                </SwiperSlide>

                <SwiperSlide className="h-full w-full flex">
                    <img className="w-full h-full object-cover" src={img2} alt="" />
                </SwiperSlide>

                <SwiperSlide className="h-full w-full flex">
                    <img className="w-full h-full object-cover" src={img3} alt="" />
                </SwiperSlide>
            </Swiper>
        </div>

    );
};

export default Sliders;