import { SyntheticEvent, useState, useTransition } from "react";
import { requestFormReset } from 'react-dom'

interface FormState{
    success: boolean
    message: null | string
    errors: {
        errors: string[]
        properties?: Record<string, { errors: string[] }>
    } | null
}

export function useFormState<T = unknown>(
    action: (data: FormData) => Promise<FormState>,
    onSuccess?: () => Promise<void> | void,
    initialState?: FormState,
) {
    const [isPending, startTransition] = useTransition();
    const [formState, setFormState] = useState<FormState>(initialState ?? {
        success: false,
        message: null,
        errors: null
    });
    
    async function handleAction(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const form = e.currentTarget;

        const data = new FormData(form);

        startTransition(async () => {
            const state = await action(data);
            
    
            setFormState(state);
            requestFormReset(form);
        });
    }

    return [formState, handleAction, isPending] as const;
}