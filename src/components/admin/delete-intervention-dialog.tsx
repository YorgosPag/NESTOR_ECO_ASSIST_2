// src/components/admin/delete-intervention-dialog.tsx
"use client";

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { deleteMasterInterventionAction } from '@/app/actions/admin';
import type { MasterIntervention } from '@/types';

const initialState = {
  message: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <AlertDialogAction asChild>
        <Button type="submit" variant="destructive" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Ναι, Διαγραφή"}
        </Button>
    </AlertDialogAction>
  );
}

interface DeleteInterventionDialogProps {
  intervention: MasterIntervention;
  children: React.ReactNode;
}

export function DeleteInterventionDialog({ intervention, children }: DeleteInterventionDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(deleteMasterInterventionAction, initialState);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!open) return; 

    if (state.message) {
      if (state.success) {
        toast({ title: 'Επιτυχία!', description: state.message });
        setOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Σφάλμα',
          description: state.message,
        });
        setOpen(false);
      }
    }
  }, [state, toast, open, setOpen]);
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Επιβεβαίωση Διαγραφής</AlertDialogTitle>
          <AlertDialogDescription>
            Είστε βέβαιος ότι θέλετε να διαγράψετε τη master παρέμβαση ‘{intervention.name}’; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={formAction} key={intervention.id}>
            <input type="hidden" name="id" value={intervention.id} />
            <AlertDialogFooter>
                <AlertDialogCancel>Άκυρο</AlertDialogCancel>
                <SubmitButton />
            </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
