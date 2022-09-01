import React from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from "../pages/landing-page/LandingPage";
import ResultsPage from "../pages/results-page/ResultsPage";
import { AnimatePresence } from 'framer-motion';
import LostPage from "../pages/404-page/LostPage";

const AnimatedRoutes = () => {
	const location = useLocation();

	return (
		<AnimatePresence>
			<Routes location={location} key={location.pathname}>
				<Route path='/' element={<LandingPage/>} />
				<Route path='/results' element={<ResultsPage/>}/>
				<Route path='*' element={<LostPage/>}/>
			</Routes>
		</AnimatePresence>
	)
}

export default AnimatedRoutes;