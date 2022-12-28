import { useState, useEffect } from 'react';
import {BrowserRouter} from 'react-router-dom';

// Routes
import CRoutes from './CRoutes';

// Layout
import CNavbar from 'layouts/CNavbar';

// react-bootstrap components
import Container from 'react-bootstrap/Container';

// bootstrap.css
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    return (
        <div className='App'>
            <BrowserRouter>
                <CNavbar />
                <Container>
                    <CRoutes />
                </Container>
            </BrowserRouter>
        </div>
    )
}

export default App;