import { Component, Suspense, type ReactNode } from 'react';

import { GitlogButton } from '@/shared/ui/GitlogButton';

class ErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

interface LoadBoundaryProps {
  children: ReactNode;
  pending: ReactNode;
  failure: ReactNode;
}

export function LoadBoundary({ children, pending, failure }: LoadBoundaryProps) {
  return (
    <ErrorBoundary fallback={failure}>
      <Suspense fallback={pending}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export function LoadErrorNotice({ message, onClose }: { message: string; onClose?: () => void }) {
  return (
    <>
      <p role="alert" className="text-sm">
        {message}
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <GitlogButton onClick={() => window.location.reload()}>새로고침</GitlogButton>
        {onClose && <GitlogButton onClick={onClose}>닫기</GitlogButton>}
      </div>
    </>
  );
}
