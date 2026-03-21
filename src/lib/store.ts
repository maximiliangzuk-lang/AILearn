import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Path } from './data';
import { DEFAULT_PATH } from './data';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
  streak: number;
  lastActiveDate: string;
  totalXP: number;
  hearts: number;
  gems: number;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  xpEarned: number;
  completedAt?: string;
  score: number;
}

export interface UserProgress {
  userId: string;
  pathId: string;
  completedLessons: LessonProgress[];
  unlockedLessons: string[];
  currentLesson?: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];

  paths: Path[];
  progress: UserProgress[];

  // 🔥 WICHTIG: HINZUGEFÜGT
  setCurrentUser: (user: User | null) => void;

  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (username: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;

  completeLesson: (lessonId: string, score: number, xp: number) => void;
  unlockLesson: (lessonId: string) => void;

  addPath: (path: Path) => void;
  addUnit: (pathId: string, unit: any) => void;
  addLesson: (pathId: string, unitId: string, lesson: any) => void;

  getUserProgress: (userId: string, pathId: string) => UserProgress | undefined;
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;

  spendGems: (amount: number) => boolean;
  addXP: (amount: number) => void;
  updateStreak: () => void;
}

const ADMIN_USER: User = {
  id: 'admin-1',
  username: 'Admin',
  email: 'admin@ailearn.com',
  password: 'admin123',
  isAdmin: true,
  createdAt: new Date().toISOString(),
  streak: 7,
  lastActiveDate: new Date().toISOString(),
  totalXP: 9999,
  hearts: 5,
  gems: 500,
};

const getInitialUnlocked = (path: Path): string[] => {
  if (path.units.length > 0 && path.units[0].lessons.length > 0) {
    return [path.units[0].lessons[0].id];
  }
  return [];
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [ADMIN_USER],
      paths: [DEFAULT_PATH],
      progress: [],

      // 🔥 DAS IST DIE FEHLENDE FUNKTION
      setCurrentUser: (user) => set({ currentUser: user }),

      login: (email, password) => {
        const users = get().users;
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) return { success: false, error: 'Invalid email or password' };

        const today = new Date().toDateString();
        const lastActive = new Date(user.lastActiveDate).toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        let newStreak = user.streak;
        if (lastActive === yesterday) newStreak += 1;
        else if (lastActive !== today) newStreak = 1;

        const updatedUser = {
          ...user,
          streak: newStreak,
          lastActiveDate: new Date().toISOString(),
        };

        set(state => ({
          currentUser: updatedUser,
          users: state.users.map(u => u.id === user.id ? updatedUser : u),
        }));

        const paths = get().paths;
        const existingProgress = get().progress.find(
          p => p.userId === user.id && p.pathId === paths[0].id
        );

        if (!existingProgress) {
          set(state => ({
            progress: [...state.progress, {
              userId: user.id,
              pathId: paths[0].id,
              completedLessons: [],
              unlockedLessons: getInitialUnlocked(paths[0])
            }]
          }));
        }

        return { success: true };
      },

      register: (username, email, password) => {
        const users = get().users;
        if (users.find(u => u.email === email)) {
          return { success: false, error: 'Email already registered' };
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          username,
          email,
          password,
          isAdmin: false,
          createdAt: new Date().toISOString(),
          streak: 1,
          lastActiveDate: new Date().toISOString(),
          totalXP: 0,
          hearts: 5,
          gems: 100,
        };

        const paths = get().paths;

        set(state => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          progress: [...state.progress, {
            userId: newUser.id,
            pathId: paths[0].id,
            completedLessons: [],
            unlockedLessons: getInitialUnlocked(paths[0])
          }]
        }));

        return { success: true };
      },

      logout: () => set({ currentUser: null }),

      completeLesson: (lessonId, score, xp) => {
        const user = get().currentUser;
        if (!user) return;

        const pathId = get().paths[0].id;

        set(state => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, totalXP: state.currentUser.totalXP + xp }
            : null,
          users: state.users.map(u =>
            u.id === user.id ? { ...u, totalXP: u.totalXP + xp } : u
          ),
          progress: state.progress.map(p => {
            if (p.userId === user.id && p.pathId === pathId) {
              return {
                ...p,
                completedLessons: [
                  ...p.completedLessons,
                  {
                    lessonId,
                    completed: true,
                    xpEarned: xp,
                    completedAt: new Date().toISOString(),
                    score,
                  },
                ],
              };
            }
            return p;
          }),
        }));
      },

      unlockLesson: (lessonId) => {
        const user = get().currentUser;
        if (!user) return;

        const pathId = get().paths[0].id;

        set(state => ({
          progress: state.progress.map(p => {
            if (p.userId === user.id && p.pathId === pathId) {
              return {
                ...p,
                unlockedLessons: [...new Set([...p.unlockedLessons, lessonId])]
              };
            }
            return p;
          })
        }));
      },

      addPath: (path) => set(state => ({ paths: [...state.paths, path] })),

      addUnit: (pathId, unit) => set(state => ({
        paths: state.paths.map(p =>
          p.id === pathId ? { ...p, units: [...p.units, unit] } : p
        )
      })),

      addLesson: (pathId, unitId, lesson) => set(state => ({
        paths: state.paths.map(p =>
          p.id === pathId
            ? {
                ...p,
                units: p.units.map(u =>
                  u.id === unitId
                    ? { ...u, lessons: [...u.lessons, lesson] }
                    : u
                ),
              }
            : p
        )
      })),

      getUserProgress: (userId, pathId) =>
        get().progress.find(p => p.userId === userId && p.pathId === pathId),

      isLessonUnlocked: (lessonId) => {
        const user = get().currentUser;
        if (!user) return false;
        if (user.isAdmin) return true;

        const pathId = get().paths[0]?.id;
        const prog = get().progress.find(
          p => p.userId === user.id && p.pathId === pathId
        );

        return prog?.unlockedLessons.includes(lessonId) ?? false;
      },

      isLessonCompleted: (lessonId) => {
        const user = get().currentUser;
        if (!user) return false;

        const pathId = get().paths[0]?.id;
        const prog = get().progress.find(
          p => p.userId === user.id && p.pathId === pathId
        );

        return prog?.completedLessons.some(l => l.lessonId === lessonId) ?? false;
      },

      getLessonProgress: (lessonId) => {
        const user = get().currentUser;
        if (!user) return undefined;

        const pathId = get().paths[0]?.id;
        const prog = get().progress.find(
          p => p.userId === user.id && p.pathId === pathId
        );

        return prog?.completedLessons.find(l => l.lessonId === lessonId);
      },

      spendGems: (amount) => {
        const user = get().currentUser;
        if (!user || user.gems < amount) return false;

        set(state => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, gems: state.currentUser.gems - amount }
            : null,
          users: state.users.map(u =>
            u.id === user.id ? { ...u, gems: u.gems - amount } : u
          )
        }));

        return true;
      },

      addXP: (amount) => {
        const user = get().currentUser;
        if (!user) return;

        set(state => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, totalXP: state.currentUser.totalXP + amount }
            : null,
          users: state.users.map(u =>
            u.id === user.id ? { ...u, totalXP: u.totalXP + amount } : u
          )
        }));
      },

      updateStreak: () => {
        const user = get().currentUser;
        if (!user) return;

        const updatedUser = {
          ...user,
          streak: user.streak + 1,
          lastActiveDate: new Date().toISOString(),
        };

        set(state => ({
          currentUser: updatedUser,
          users: state.users.map(u => u.id === user.id ? updatedUser : u)
        }));
      },
    }),
    { name: 'ai-learn-store' }
  )
);