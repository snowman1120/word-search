import {Routes, Route} from 'react-router-dom';

// Page Components
import Main from 'pages/main/Main';
import UserScores from 'pages/user-scores/UserScores';

const CRoutes = () => {
    return (
        <Routes>
            {/* Main */}
            <Route path='/' element={(<Main />)} />

            {/* UserScores */}
            <Route path='/scores' element={(<UserScores />)} />
        </Routes>
    )
}

export default CRoutes;