import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFaculties } from "../../services/faculty/facultyService";

interface FacultyState {
    faculties: any;
    lastSundayFetched: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}


function getSundayOfWeek(date = new Date()) {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const sunday = new Date(date.setDate(diff));
    sunday.setHours(0, 0, 0, 0);
    return sunday.toISOString().split('T')[0];
}

const initialState: FacultyState = {
    faculties: null,
    lastSundayFetched: null,
    status: 'idle',
    error: null
};

const fetchFacultiesIfNeeded = createAsyncThunk<
    { data?: any; sunday?: string; cached?: boolean }, // Return type
    void,                                              // Argument
    { state: { faculty: FacultyState } }               // ThunkAPI type
>(
    'data/getFaculties',
    async (_, { getState }) => {
        const state = getState().faculty;
        const today = new Date();

        const todayIsSunday = today.getDay() === 0;
        const currentSunday = getSundayOfWeek();

        if (!todayIsSunday || state.lastSundayFetched === currentSunday) {
            return { cached: true };
        }

        const response = await getFaculties();
        return { data: response, sunday: currentSunday };
    }
);

const facultySlice = createSlice({
    name: 'faculty',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFacultiesIfNeeded.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFacultiesIfNeeded.fulfilled, (state, action) => {
                if (!action.payload.cached) {
                    state.faculties = action.payload.data;
                    state.lastSundayFetched = action.payload.sunday ?? null;
                }
                state.status = 'succeeded';
            })
            .addCase(fetchFacultiesIfNeeded.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            });
    },
});

export { fetchFacultiesIfNeeded };
export default facultySlice.reducer;