import React, { useEffect, useState } from 'react';
import AlertMessage from '../components/AlertMessage';

export default function FindRoom() {
    const [price, setPrice] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [babies, setBabies] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const [alert, setAlert] = useState(false);
    const [minPrice, setMinPrice] = useState('Desde');
    const [searched, setSearched] = useState(false);
    const uniqueRoomKeys = [...new Set(searchResults.map(room => room.room_key))];

    const handlePriceChange = (event) => {
        const inputValue = event.target.value;
        if (/^\d*\.?\d*$/.test(inputValue) || inputValue === '') {
            setPrice(inputValue);
        }
    };

    const handleCloseAlert = () => {
        setAlert(false);
    };

    const handleSearch = () => {
        fetch(`http://localhost:5000/search?adults=${adults}&children=${children}&babies=${babies}&price=${price}`)
            .then(response => response.json())
            .then(data => {
                setSearchResults(data);
                if (data.length === 0) {
                    const formattedOccupancy = `${adults} adulto${adults !== 1 ? 's' : ''}, ${children} niño${children !== 1 ? 's' : ''}, ${babies} bebé${babies !== 1 ? 's' : ''}`;
                    setAlert({ show: true, message: `Lo sentimos, no hay opciones disponibles para ${formattedOccupancy}${price !== '' && parseFloat(price) !== 0 ? ` y un precio máximo de ${price} €` : ''}` });
                } else {
                    setAlert({ show: false, message: '' });
                }
                const min = Math.min(...data.map(room => room.price));
                setMinPrice(min);
            })
            .catch(error => console.error('Error searching rooms:', error))
            .finally(() => setSearched(true));
    };

    useEffect(() => {
        fetch('http://localhost:5000/rooms')
            .then(response => response.json())
            .then(data => {
                setSearchResults(data);
                const min = Math.min(...data.map(room => room.price));
                setMinPrice(min);
            })
            .catch(error => console.error('Error fetching rooms:', error))
    }, [])

    return (
        <div className="bg-gray-200 min-h-screen flex flex-col  items-center">
            <div className="mt-[50px] w-full p-6 bg-white shadow-md rounded-md mb-8">
                <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                        <label htmlFor="adults" className="text-sm font-medium text-gray-700">Adultos (mínimo 1, máximo 4)</label>
                        <input type="number" id="adults" name="adults" onChange={(e) => setAdults(e.target.value)} min="1" max="4" className="w-14 h-8 rounded-md text-center bg-pink-100 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                        <label htmlFor="children" className="text-sm font-medium text-gray-700">Niños (mínimo 0, máximo 2)</label>
                        <input type="number" id="children" name="children" onChange={(e) => setChildren(e.target.value)} min="0" max="2" className="w-14 h-8 rounded-md text-center border-gray-300 shadow-sm  bg-pink-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                        <label htmlFor="babies" className="text-sm font-medium text-gray-700">Bebés (mínimo 0, máximo 1)</label>
                        <input type="number" id="babies" name="babies" onChange={(e) => setBabies(e.target.value)} min="0" max="1" className="w-14 h-8 rounded-md text-center border-gray-300 shadow-sm focus:border-indigo-300 focus:ring  bg-pink-100 focus:ring-indigo-200 focus:ring-opacity-50" />
                        <label htmlFor="price" className="text-sm font-medium text-gray-700">Precio máximo</label>
                        <div className='relative w-40'>
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-600">€</span>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={price}
                                onChange={handlePriceChange}
                                placeholder="Precio máximo"
                                className="pl-8 pr-4 w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200   bg-pink-100 focus:ring-opacity-50"
                            />
                            {price && (
                                <span className="ml-10 absolute inset-y-0 right-0 flex items-center pr-2 text-gray-600">,00</span>
                            )}
                        </div>
                        <button type="submit" onClick={handleSearch} className="w-18 bg-pink-900 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring focus:ring-pink-600 focus:ring-opacity-50">Buscar Habitación</button>
                    </div>
                </div>
            </div>
            <AlertMessage showAlert={alert.show} message={alert.message} onClose={handleCloseAlert} />
            <div className="flex flex-col items-center">
                {uniqueRoomKeys.map((roomKey) => {
                    const rooms = searchResults.filter(room => room.room_key === roomKey);
                    const uniqueRoomName = rooms[0].room_name;

                    return (
                        <div key={roomKey} className="w-full mt-4 rounded-lg bg-white shadow-md p-4">
                            <p className="text-lg text-center font-semibold text-pink-900 mb-4 border-b-2">{uniqueRoomName}</p>
                            {rooms.map((room, index) => (
                                <div key={`${roomKey}-${index}`} className="w-[500px] mt-4 rounded-lg bg-white shadow-md p-2 flex items-center">
                                    <div>
                                        <img
                                            src={`/static/images/${room.room_picture}`}
                                            alt={room.room_name}
                                            className="w-40 h-40 object-cover rounded-lg mr-4"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <p className="text-base border-b-2 font-semibold text-gray-900 text-[20px]">{room.rate_name}</p>
                                        <p className="text-base text-gray-600 mb-2 text-[10px]">{searched ? 'Precio:' : 'Desde'}</p>
                                        <p className="font-semibold text-lg text-gray-900 text-[40px]">{room.price} €</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
