import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const truncateString = (string: string) => {
  return string.slice(0, 130) + "..."
}

export function getInitials(name: string) {
  return name
    .split(" ") // Split the name by spaces
    .map((word) => word[0]) // Take the first letter of each word
    .join("") // Join them to form the initials
    .toUpperCase(); // Convert to uppercase
}

export const getYouTubeVideoId = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
};