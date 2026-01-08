"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreatePlaylist, useAddContentToPlaylist } from "@/hooks/usePlaylist";

interface CreatePlaylistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  contentId?: string; // Optional content ID to add after creating
}

export function CreatePlaylistModal({
  open,
  onOpenChange,
  onSuccess,
  contentId,
}: CreatePlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const { mutate: createPlaylist, isPending: isCreating } = useCreatePlaylist();
  const { mutate: addContentToPlaylist, isPending: isAdding } = useAddContentToPlaylist();

  const isPending = isCreating || isAdding;

  const handleCreate = (addContent: boolean = false) => {
    if (!playlistName.trim()) return;

    createPlaylist(
      {
        name: playlistName,
        description: playlistDescription || undefined,
      },
      {
        onSuccess: (newPlaylist) => {
          if (addContent && contentId) {
            // Add content to the newly created playlist
            addContentToPlaylist(
              {
                playlistId: newPlaylist.id,
                contentId: contentId,
              },
              {
                onSuccess: () => {
                  setPlaylistName("");
                  setPlaylistDescription("");
                  onOpenChange(false);
                  onSuccess?.();
                },
              }
            );
          } else {
            setPlaylistName("");
            setPlaylistDescription("");
            onOpenChange(false);
            onSuccess?.();
          }
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      setPlaylistName("");
      setPlaylistDescription("");
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isPending) {
      setPlaylistName("");
      setPlaylistDescription("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>
            {contentId 
              ? "Give your playlist a name and optional description. You can save it or save and add the current content to it."
              : "Give your playlist a name and optional description."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Playlist Name</Label>
            <Input
              id="name"
              placeholder="e.g. Morning Reminders"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && playlistName.trim() && !isPending) {
                  handleCreate();
                }
              }}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="A brief description of your playlist"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && playlistName.trim() && !isPending) {
                  handleCreate();
                }
              }}
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          {contentId ? (
            <>
              <Button
                onClick={() => handleCreate(false)}
                disabled={isPending || !playlistName.trim()}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {isCreating ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={() => handleCreate(true)}
                disabled={isPending || !playlistName.trim()}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              >
                {isPending ? "Saving..." : "Save & Add"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => handleCreate(false)}
              disabled={isPending || !playlistName.trim()}
              className="w-full sm:w-auto"
            >
              {isCreating ? "Saving..." : "Save"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

