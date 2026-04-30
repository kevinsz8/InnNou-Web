
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Users from '@/pages/Users';
import PrivateRoute from '../core/auth/PrivateRoute';
import Hotels from '../pages/Hotels';

export const appRoutes = [
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/dashboard',
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        ),
    },
  {
    path: '/users',
    element: (
      <PrivateRoute>
        <Users />
      </PrivateRoute>
    ),
    },
    {
        path: '/hotels',
        element: (
            <PrivateRoute>
                <Hotels />
            </PrivateRoute>
        ),
    },
];
