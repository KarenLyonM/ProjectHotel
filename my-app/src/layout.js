import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import FindRoom from './views/FindRoom';
import Home from './views/Home';
import RoomDetailsView from './views/RoomDetails';

function Layout() {
    return (
        <Router>
            <div>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/find-room" element={<FindRoom />} />
                    <Route path="/room/detail/:roomId" element={<RoomDetailsView />} />
                </Routes>
            </div>
        </Router>
    );
}

export default Layout;
