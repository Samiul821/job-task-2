import React from 'react';
import Heading from '../../Components/Heading';
import Contact from '../../Components/Contact';

const Home = () => {
    return (
        <div className='min-h-screen bg-gray-50 p-4'>
            <Heading></Heading>
            <Contact />
        </div>
    );
};

export default Home;