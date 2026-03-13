function joinClassNames(...classNames: (string | undefined | false | null)[]) {
  return classNames.filter(Boolean).join(' ');
}

interface SkeletonProps {
  className?: string;
}

function SkeletonCircle({ className }: SkeletonProps) {
  return (
    <div className={joinClassNames('animate-pulse rounded-full bg-gray-200', className)} />
  );
}

function SkeletonLine({ className }: SkeletonProps) {
  return (
    <div className={joinClassNames('animate-pulse rounded bg-gray-200', className)} />
  );
}

function SkeletonPill({ className }: SkeletonProps) {
  return (
    <div
      className={joinClassNames(
        'animate-pulse rounded-full bg-gray-200',
        className,
      )}
    />
  );
}

interface SkeletonAvatarMetaProps {
  className?: string;
  avatarClassName?: string;
  firstLineClassName?: string;
  secondLineClassName?: string;
}

function SkeletonAvatarMeta({
  className,
  avatarClassName = 'h-10 w-10',
  firstLineClassName = 'h-4 w-16',
  secondLineClassName = 'h-4 w-12',
}: SkeletonAvatarMetaProps) {
  return (
    <div className={joinClassNames('flex items-center gap-3', className)}>
      <SkeletonCircle className={avatarClassName} />
      <div>
        <SkeletonLine className={joinClassNames('mb-1', firstLineClassName)} />
        <SkeletonLine className={secondLineClassName} />
      </div>
    </div>
  );
}

export { SkeletonCircle, SkeletonLine, SkeletonPill, SkeletonAvatarMeta };
