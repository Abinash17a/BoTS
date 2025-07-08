// src/store/projectSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
  projectName: string;
  clientName: string;
  clientEmail: string;
}

const initialState: ProjectState = {
  projectName: '',
  clientName: '',
  clientEmail: '',
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectInfo: (state, action: PayloadAction<ProjectState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setProjectInfo } = projectSlice.actions;
export default projectSlice.reducer;
