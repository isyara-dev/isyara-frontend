export default function ModuleItem({ letter, status }) {
    return (
      <div className="flex items-center justify-between py-3 px-4 border-b border-blue-700 last:border-0">
        <span className="text-xl font-bold">{letter}</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          status === 'Completed' 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {status}
        </span>
      </div>
    )
  }