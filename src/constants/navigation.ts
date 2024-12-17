import { 
  HomeIcon, 
  ChartBarIcon, 
  UserIcon, 
  Cog6ToothIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

export const MAIN_NAVIGATION = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Parlay',
    path: '/schedule',
    icon: TrophyIcon
  },
  {
    name: 'History',
    path: '/history',
    icon: ChartBarIcon
  }
];

export const USER_FEATURES = [
  {
    name: 'Profile',
    path: '/profile',
    icon: UserIcon
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Cog6ToothIcon
  }
]; 