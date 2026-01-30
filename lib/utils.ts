import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// Get slug from content item (use existing slug or generate from title)
export function getContentSlug(content: { slug?: string; title: string }): string {
  return content.slug || createSlug(content.title);
}

// Get slug from course item (generate from title)
export function getCourseSlug(course: { title: string }): string {
  return createSlug(course.title);
}

// Get slug from playlist (name_slug-id for URL, API uses id)
export function getPlaylistSlug(playlist: { id: string; name: string }): string {
  return `${createSlug(playlist.name)}-${playlist.id}`;
}

// Parse playlist id from URL slug (slug is "name_slug-uuid")
export function parsePlaylistIdFromSlug(slug: string): string | null {
  const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
  const match = slug.match(uuidPattern);
  return match ? match[1] : null;
}
