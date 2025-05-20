export default function Button({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'md',
    className = ''
  }) {
    const baseClasses = 'font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500'
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg'
    }
    
    const variantClasses = {
      primary: 'bg-amber-500 hover:bg-amber-600 text-indigo-900 shadow-md',
      secondary: 'bg-indigo-700 hover:bg-indigo-600 text-white',
      outline: 'border border-amber-500 text-amber-500 hover:bg-amber-500/10'
    }
    
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    )
  }