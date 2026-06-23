'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AvatarItem {
  src?: string;
  name: string;
  fallback?: string;
}

interface AvatarGroupProps {
  avatars: AvatarItem[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: {
    avatar: 'size-6',
    text: 'text-xs',
    counter: 'size-6 text-[10px]',
    overlap: '-space-x-1.5',
  },
  md: {
    avatar: 'size-8',
    text: 'text-xs',
    counter: 'size-8 text-xs',
    overlap: '-space-x-2',
  },
  lg: {
    avatar: 'size-10',
    text: 'text-sm',
    counter: 'size-10 text-sm',
    overlap: '-space-x-2.5',
  },
} as const;

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function AvatarGroupComponent({
  avatars,
  max = 3,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const config = sizeConfig[size];
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const sizeMap = {
    sm: 'sm' as const,
    md: 'default' as const,
    lg: 'lg' as const,
  };

  return (
    <div
      className={cn('flex items-center', config.overlap, className)}
      role="group"
      aria-label={`Group of ${avatars.length} users`}
    >
      {visibleAvatars.map((avatar, index) => (
        <Tooltip key={`${avatar.name}-${index}`}>
          <TooltipTrigger
            render={
              <Avatar
                size={sizeMap[size]}
                className={cn(
                  'ring-2 ring-background transition-transform hover:z-10 hover:scale-110',
                  config.avatar
                )}
              />
            }
          >
            {avatar.src && (
              <AvatarImage src={avatar.src} alt={avatar.name} />
            )}
            <AvatarFallback className={config.text}>
              {avatar.fallback ?? getInitials(avatar.name)}
            </AvatarFallback>
          </TooltipTrigger>
          <TooltipContent>
            <p>{avatar.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
      {remaining > 0 && (
        <Tooltip>
          <TooltipTrigger
            render={
              <div
                className={cn(
                  'relative flex shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground ring-2 ring-background',
                  config.counter
                )}
                aria-label={`${remaining} more users`}
              />
            }
          >
            +{remaining}
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {avatars
                .slice(max)
                .map((a) => a.name)
                .join(', ')}
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export { AvatarGroupComponent as AvatarGroup, type AvatarGroupProps, type AvatarItem };
