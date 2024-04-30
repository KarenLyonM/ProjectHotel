import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/rooms')
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Error fetching Rooms', error));
    }, []);

    useEffect(() => {
        if (inView) {
            setIsVisible(true);
        }
    }, [inView]);

    const redirectToRoomDetails = (roomId) => {
        navigate(`/room/detail/${roomId}`);
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className={`bg-white py-24 sm:py-32 mx-auto max-w-7xl px-6 lg:px-8 ${isVisible ? 'animate-fadeIn duration-10000' : ''}`}>
                <div className="mx-auto max-w-2xl sm:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Green Bay Hotel</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">Bienvenido a Green Bay Hotel, donde encontrarás las mejores habitaciones para tu estancia.</p>
                </div>
            </div>
            <div className="flex flex-wrap justify-center mt-10">
                {rooms.map(room => (
                    <div key={room.room_key} className="bg-white border border-gray-200 rounded-lg shadow overflow-hidden m-4 w-[500px]">
                        <img className="w-full h-60 object-cover object-center rounded-t-lg" src={`./static/images/${room.room_picture}`} alt={room.room_name} />
                        <div className="p-5">
                            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">{room.room_name}</h5>
                            <p className="mb-3 text-sm text-gray-700">{room.room_description.length > 50 ? `${room.room_description.slice(0, 50)}...` : room.room_description}</p>
                            <button onClick={() => redirectToRoomDetails(room.room_key)} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-50">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
