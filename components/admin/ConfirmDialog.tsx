"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  requireReason = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  requireReason?: boolean;
  onConfirm: (reason?: string) => void;
}) {
  const [reason, setReason] = React.useState("");
  React.useEffect(() => { if (!open) setReason(""); }, [open]);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md rounded-lg border bg-background p-4 shadow-lg focus:outline-none">
          <div className="flex items-start justify-between gap-3">
            <Dialog.Title className="font-semibold">{title}</Dialog.Title>
            <Dialog.Close className="inline-flex items-center justify-center w-8 h-8 rounded-md border" aria-label="Close">
              <XIcon className="w-4 h-4" />
            </Dialog.Close>
          </div>
          {description ? <Dialog.Description className="text-sm text-muted-foreground mt-1">{description}</Dialog.Description> : null}
          {requireReason ? (
            <div className="mt-3">
              <label className="block text-sm mb-1">Reason</label>
              <input
                className="h-9 w-full px-2 rounded-md border"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide a reason"
                aria-label="Reason"
              />
            </div>
          ) : null}
          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline">{cancelText}</Button>
            </Dialog.Close>
            <Button onClick={() => { onConfirm(requireReason ? reason : undefined); }}>
              {confirmText}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 