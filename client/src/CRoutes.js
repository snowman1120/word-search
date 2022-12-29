import {Routes, Route} from 'react-router-dom';

// Page Components
import Main from 'pages/main/Main';
import LeaderBoard from 'pages/leader-board/LeaderBoard';

const CRoutes = () => {
    return (
        <Routes>
            {/* LeaderBoard */}
            <Route path='/' element={(<LeaderBoard />)} />

            {/* Main */}
            <Route path='/play' element={(<Main />)} />
        </Routes>
    )
}

export default CRoutes;