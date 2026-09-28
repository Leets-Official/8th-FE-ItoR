import type { ReactNode } from 'react';

interface EmptyStateProps {
  message: string;
  description?: string;
  action?: ReactNode;
}

function EmptyState({ message, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-1 py-12 text-center">
      <p className="text-sm text-gray-400">{message}</p>
      {description && <p className="text-sm text-gray-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
