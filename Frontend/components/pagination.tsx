import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export function PaginationControlled({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems || 0);

  return (
    <div className='flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row'>
      {/* Vänster: Info */}
      <div className='text-xs text-muted-foreground'>
        {totalItems ? (
          <>
            Showing <span className='text-foreground'>{from}</span> to{' '}
            <span className='text-foreground'>{to}</span> of{' '}
            <span className='font-medium text-foreground'>{totalItems}</span>{' '}
            results
          </>
        ) : (
          <>
            Page{' '}
            <span className='font-medium text-foreground'>{currentPage}</span>{' '}
            of <span className='font-medium text-foreground'>{totalPages}</span>
          </>
        )}
      </div>

      {/* Höger: Kontroller */}
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          className='h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3 sm:py-2'
          disabled={currentPage === 1}
          onClick={() => {
            onPageChange(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <ChevronLeft className='h-4 w-4 sm:mr-1' />
          <span className='hidden sm:inline'>Previous</span>
        </Button>

        <div className='flex h-8 min-w-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium sm:h-9'>
          {currentPage} / {totalPages}
        </div>

        <Button
          variant='outline'
          size='sm'
          className='h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3 sm:py-2'
          disabled={currentPage >= totalPages}
          onClick={() => {
            onPageChange(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className='hidden sm:inline'>Next</span>
          <ChevronRight className='h-4 w-4 sm:ml-1' />
        </Button>
      </div>
    </div>
  );
}
