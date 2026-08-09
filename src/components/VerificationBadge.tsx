import { Clock, XCircle } from 'lucide-react';
import type { VerificationStatus } from '../types';

interface Props {
  status: VerificationStatus | boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const VerificationBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const isVerified = status === true || status === 'VERIFIED';
  const isPending = status === 'PENDING';

  if (isVerified) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-teal-300/30 text-teal-100 border border-teal-300/40 backdrop-blur-xs tracking-wider uppercase ${size === 'lg' ? 'text-xs py-1 px-3.5' : ''}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse"></span>
        <span>VERIFIED</span>
      </span>
    );
  }

  if (isPending) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30 ${size === 'lg' ? 'text-sm py-1.5 px-3' : ''}`}>
        <Clock className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>Pending</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-200 border border-rose-400/30 ${size === 'lg' ? 'text-sm py-1.5 px-3' : ''}`}>
      <XCircle className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>Unverified</span>
    </span>
  );
};
