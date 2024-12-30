
"use client"
import React from "react";
import Heading from "./Heading";
import Button from "./Button";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showButton?: boolean;
  onClick?: () => void;
  label?: string
}

export default function EmptyState({
  title = "No listing found",
  subtitle = "You have no listing. Try creating one",
  onClick,
  label,
  showButton,
}: EmptyStateProps) {
  return (
    <div className="h-[60vh] w-full flex flex-col gap-2 justify-center items-center">
        <Heading
        title={title}
        subtitle={subtitle}
        center
        titleClassName="text-rose-500"
        subtitleClassName="text-rose-500"
        />
        <div className="w-48 mt-4">
            {showButton && (
                <Button
                onClick = {() => onClick && onClick()} 
                actionLabel={label}
                classNames="w-[40%] bg-black text-black"
                />
            )}
        </div>
       
    </div>
  )
}
