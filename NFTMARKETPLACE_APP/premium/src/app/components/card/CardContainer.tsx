
interface CardContainerProps {
    children: React.ReactNode;
    className?: string;
}

const CardContainer = ({children, className = ""}: CardContainerProps) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 w-[80%] max-w-[2000px] mx-auto ${className}`}>
      {children}
    </div>
  )
}
export default CardContainer; 