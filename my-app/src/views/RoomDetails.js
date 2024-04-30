import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RoomDetailsView = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/room/detail/${roomId}`)
            .then(response => response.json())
            .then(data => setRoom(data))
            .catch(error => console.error('Error fetching Room details', error))
    }, [roomId]);

    if (!room) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-7xl mx-auto bg-white rounded-lg p-8">
                    <h2 className="text-3xl font-bold mb-4">{room.room_name}</h2>
                    <p className="mb-4 text-gray-600">{room.room_description}</p>
                    <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-1/2 sm:mr-8 mb-8 sm:mb-0">
                            <img src={`/static/images/${room.room_picture}`} alt={room.room_name} className="w-full rounded-lg" />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <h4 className="text-xl font-bold mb-4">Precios por ocupación y tarifa:</h4>
                            <ul>
                                {room.prices && room.prices.map((prices, index) => (
                                    <li key={index}>
                                        {prices.map((price, idx) => (
                                            <div className='mb-5' key={idx}>
                                                <div className="text-gray-800 font-bold">
                                                    <span>{price.target_occupancy ? price.target_occupancy.join(', ') : ' '}</span>
                                                </div>
                                                <div className="mt-3 flex justify-between">
                                                    <p>{price.rate_name}</p>
                                                    <p>{price.price},00 €</p>
                                                </div>
                                            </div>
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailsView;
