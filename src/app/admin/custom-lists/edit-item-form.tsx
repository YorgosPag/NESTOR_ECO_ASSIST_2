// src/app/admin/custom-lists/edit-item-form.tsx
"use client";

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateCustomListItemAction } from '@/app/actions/admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { CustomListItem } from '@/types';

const initialState = { success: false, errors: {}, message: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Αποθήκευση Αλλαγών"}
    </Button>
  );
}

interface EditItemFormProps {
    item: CustomListItem;
    setOpen: (open: boolean) => void;
}

export function EditItemForm({ item, setOpen }: EditItemFormProps) {
    const [state, formAction] = useActionState(updateCustomListItemAction, initialState);
    const { toast } = useToast();
    
    useEffect(() => {
        if (state.success) {
            toast({ title: 'Επιτυχία!', description: state.message });
            setOpen(false);
        } else if (state.message) {
            toast({ variant: 'destructive', title: 'Σφάλμα', description: state.message });
        }
    }, [state, toast, setOpen]);

    return (
        <form action={formAction} className="space-y-4 pt-4">
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="listId" value={item.listId} />
            <div className="space-y-2">
                <Label htmlFor="name">Όνομα Στοιχείου</Label>
                <Input id="name" name="name" defaultValue={item.name} required />
                {state.errors?.name && <p className="text-sm font-medium text-destructive mt-1">{state.errors.name[0]}</p>}
            </div>
            <SubmitButton />
        </form>
    );
}
