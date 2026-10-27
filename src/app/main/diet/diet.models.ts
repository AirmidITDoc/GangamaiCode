export type MealKey = 'earlyMorning' | 'breakfast' | 'midMorning' | 'lunch' | 'eveningSnacks' | 'dinner';
export type MealStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Ready' | 'Dispatched' | 'Delivered' | 'Rejected' | 'Cancelled';
export const MEAL_STATUSES: MealStatus[] = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Dispatched', 'Delivered', 'Rejected', 'Cancelled'];

export interface MealSlot { key: MealKey; label: string; time: string; icon: string; }
export const MEAL_SLOTS: MealSlot[] = [
  { key: 'earlyMorning', label: 'Early Morning', time: '06:00 AM', icon: 'free_breakfast' },
  { key: 'breakfast', label: 'Breakfast', time: '08:00 AM', icon: 'restaurant' },
  { key: 'midMorning', label: 'Mid-Morning', time: '10:30 AM', icon: 'nutrition' },
  { key: 'lunch', label: 'Lunch', time: '12:30 PM', icon: 'lunch_dining' },
  { key: 'eveningSnacks', label: 'Evening Snacks', time: '04:00 PM', icon: 'bakery_dining' },
  { key: 'dinner', label: 'Dinner', time: '07:00 PM', icon: 'dinner_dining' },
];

export interface FoodItem { name: string; qty: string; instruction?: string; }
export interface MealEntry { items: FoodItem[]; status: MealStatus; notes?: string; }
/** key = `${yyyy-MM-dd}|${MealKey}` */
export type PatientPlan = Record<string, MealEntry>;

export interface Patient {
  regNo: string; name: string; type: 'IP' | 'OP'; admissionNo: string; ward: string;
  age: number; gender: 'Male' | 'Female'; dietType: string; allergies: string;
}

export const PLANNER_DAY_COLORS = ['#1e88e5', '#00acc1', '#43a047', '#fb8c00', '#8e24aa', '#ec407a', '#3949ab'];
export const VIEW_DAY_COLORS = ['#f57c00', '#6a4c93', '#7cb342', '#d32f2f', '#4db6ac', '#1565c0', '#00838f'];

export const FOOD_CATALOG = [
  'Warm Milk', 'Herbal Drink', 'Idli', 'Sambar', 'Poha', 'Upma', 'Dosa', 'Paratha', 'Curd', 'Fruit', 'Apple', 'Banana',
  'Orange Juice', 'Rice', 'Dal', 'Roti', 'Mixed Vegetable', 'Sabzi', 'Khichdi', 'Soup', 'Biscuits', 'Tea', 'Sandwich',
  'Oatmeal', 'Scrambled Eggs', 'Boiled Egg', 'Chicken Soup', 'Grilled Chicken', 'Salad', 'Buttermilk', 'Cornflakes',
];
