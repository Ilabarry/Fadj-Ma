import { Routes, Route } from 'react-router-dom'
import Connexion from './Connexion';
import Inscription from './Inscription';
import Navigation from '../component/navigationComponent';

function LogPage(){
    return(
        <div className='px-4 sm:px-8 md:px-16 lg:px-32 xl:px-60 bg-gray-800'>
            <div className='min-h-screen bg-gray-100'>
                <Navigation />
                <Routes>
                    <Route path="/" element={<Connexion />} />
                    <Route path="/inscription" element={<Inscription />} />
                </Routes>
            </div>
        </div>
    )
}   

export default LogPage;