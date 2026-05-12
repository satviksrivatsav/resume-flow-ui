import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useResumeStore } from '@/stores/resumeStore';
import { supabase } from '@/lib/supabase';

const DEBOUNCE_DELAY = 10000; // 10 seconds

export const useAutoSave = () => {
  const resumeData = useResumeStore((state) => state.resumeData);
  const setResumeData = useResumeStore((state) => state.setResumeData);
  const setIsSaving = useResumeStore((state) => state.setIsSaving);
  const setLastSaved = useResumeStore((state) => state.setLastSaved);
  const user = useAuthStore((state) => state.user);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  const saveNow = useCallback(async () => {
    const currentDataString = JSON.stringify(resumeData);
    
    // Clear any pending auto-save timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setIsSaving(true);
    
    try {
      if (user) {
        let finalName = resumeData.name;

        // If it's a new resume, figure out a smart, unique name
        if (!resumeData.id) {
          const baseName = (resumeData.name && resumeData.name !== 'Untitled Resume') 
            ? resumeData.name 
            : (resumeData.basics.name || 'Untitled Resume');

          // Fetch existing names to ensure uniqueness
          const { data: existingResumes } = await supabase
            .from('resumes')
            .select('name')
            .eq('user_id', user.id);

          const existingNames = existingResumes?.map((r) => r.name) || [];
          
          finalName = baseName;
          if (existingNames.includes(baseName)) {
            let counter = 1;
            while (existingNames.includes(`${baseName} ${counter}`)) {
              counter++;
            }
            finalName = `${baseName} ${counter}`;
          }
        }

        // Logged in: upsert to Supabase
        const upsertData: any = {
          user_id: user.id,
          name: finalName || 'Untitled Resume',
          data: { ...resumeData, name: finalName }, // ensure the internal data name matches
          updated_at: new Date().toISOString(),
        };

        if (resumeData.id) {
          upsertData.id = resumeData.id;
        }

        const { data, error } = await supabase
          .from('resumes')
          .upsert(upsertData)
          .select('id, name')
          .single();

        if (error) throw error;
        
        let finalId = resumeData.id;
        if (data && (data.id !== resumeData.id || data.name !== resumeData.name)) {
           finalId = data.id;
           setResumeData({ ...resumeData, id: data.id, name: data.name });
        }
        lastSavedDataRef.current = JSON.stringify({ ...resumeData, id: finalId, name: data?.name || finalName });
      } else {
        // Anonymous: save to sessionStorage
        sessionStorage.setItem('rf-anonymous-resume', currentDataString);
        lastSavedDataRef.current = currentDataString;
      }
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  }, [resumeData, user, setResumeData, setIsSaving, setLastSaved]);

  useEffect(() => {
    // Prevent auto-save on initial mount if data hasn't changed
    const currentDataString = JSON.stringify(resumeData);
    if (lastSavedDataRef.current === currentDataString) {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set isSaving to true when the timer starts to indicate "changes pending/saving"
    // Actually, the goal says "Update isSaving to true when the timer starts or when the async save starts"
    setIsSaving(true);

    timerRef.current = setTimeout(async () => {
      await saveNow();
    }, DEBOUNCE_DELAY);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resumeData, saveNow, setIsSaving]);

  return { saveNow };
};
