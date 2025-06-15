export interface Game {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image: string|null;
  isActive: boolean;
  createdAt: Date;
}

export interface TimeSlot {
  id: string;
  gameId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedBy?: string;
  playerName?: string;
  playerEmail?: string;
  playerPhone?: string;
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  image? :string;
}

export interface Booking {
  id: string;
  gameId: string;
  gameName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: 'confirmed' | 'cancelled';
  bookedAt: string;
}