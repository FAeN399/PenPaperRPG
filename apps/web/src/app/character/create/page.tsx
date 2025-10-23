import { CreationWizard } from '@/components/creation/CreationWizard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorFallback } from '@/components/ErrorFallback';

export default function CharacterCreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary
        fallback={
          <ErrorFallback
            title="Character Creation Error"
            message="We encountered an error while loading the character creation wizard. Please try refreshing the page."
          />
        }
      >
        <CreationWizard />
      </ErrorBoundary>
    </div>
  );
}