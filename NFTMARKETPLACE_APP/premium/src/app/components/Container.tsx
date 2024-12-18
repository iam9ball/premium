'use client'

interface ContainerProps {
    children: React.ReactNode
}

export default function Container ({children}: ContainerProps) {
    return (
        <main>
        <div className="px-6 py-4">
            {children}
        </div>
        </main>
    )
}

