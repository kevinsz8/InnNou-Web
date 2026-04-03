
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { appRoutes } from './routes/appRoutes';
import { AuthProvider } from './core/auth/authContext';
import { Toaster } from 'react-hot-toast'; 
import Loader from './components/ui/Loader';

function App() {
    return (
        <BrowserRouter>
        <AuthProvider>
                <Toaster position="bottom-right" />
                <Routes>
                  {appRoutes.map(route => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                </Routes>
           
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
