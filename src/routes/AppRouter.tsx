import { useRoutes } from 'react-router-dom';
import { appRoutes } from './appRoutes';

export default function AppRouter() {
    return useRoutes(appRoutes);
}