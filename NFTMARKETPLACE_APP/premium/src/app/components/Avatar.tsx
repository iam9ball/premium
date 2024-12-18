'use client'
import Image from "next/image"
import placeholder from "@public/placeholder.jpg"

interface AvatarProps {
  src?: string | null | undefined
}
export default function Avatar({src}: AvatarProps) {
  return (
    <Image 
    className="rounded-full"
    width="30"
    height="30"
    alt="Avatar"
    src={src || placeholder}
    />
  )
}
