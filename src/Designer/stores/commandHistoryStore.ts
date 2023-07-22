import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  open: boolean;
  history: string[];
  clear: () => void;
  setOpen: (newVal: boolean) => void;
  saveCommand: (command: string) => void;
  deleteLastCommand: () => void;
}

export const useCommandHistoryStore = create(
  persist(
    immer<State>((set) => ({
      open: false,
      history: [],
      clear() {
        set((prev) => {
          prev.history = [];
        });
      },
      setOpen(newVal) {
        set((prev) => {
          prev.open = newVal;
        });
      },
      saveCommand(command: string) {
        set((prev) => {
          prev.history.push(command);
        });
      },
      deleteLastCommand() {
        set((prev) => {
          prev.history.pop();
        });
      },
    })),
    { name: 'fsd-command-history' },
  ),
);
