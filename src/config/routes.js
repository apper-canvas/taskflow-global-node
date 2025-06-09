import Home from '../pages/Home';
import HomePage from '@/components/pages/HomePage'; // This import needs to change
export const routes = {
  home: {
    id: 'home',
    label: 'Tasks',
    path: '/tasks',
//     component: HomePage, // This component needs to change
    component: Home
  }
};

export const routeArray = Object.values(routes);