import { AlertCircle } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { ApiError } from "@/lib/shared/api-error";

type ErrorStateProps = {
  error: ApiError;
  onRetry?: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-12 text-center dark:border-white/5 dark:bg-white/3">
      <AlertCircle className="text-red-500" size={32} />

      <div>
        <p className="font-medium text-gray-800 dark:text-white">
          {error.error}
        </p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>

      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
