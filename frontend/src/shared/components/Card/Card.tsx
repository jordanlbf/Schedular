import type { ReactNode } from 'react';
import clsx from 'clsx';
import './Card.css';

type Variant = 'form' | 'summary' | 'action';
type Size = 'normal' | 'compact';

type CardProps = {
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
} & React.HTMLAttributes<HTMLElement>;

export function Card({
  title,
  children,
  footer,
  variant = 'form',
  size = 'normal',
  className,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  ...rest
}: CardProps) {
  return (
    <section
      className={clsx(
        'form-card',
        size === 'compact' && 'compact-card',
        variant === 'summary' && 'summary-card',
        className
      )}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      {...rest}
    >
      {title !== undefined && (
        <header className="form-card-header">
          <h3>{title}</h3>
        </header>
      )}
      <div className="form-card-body">{children}</div>
      {footer && <footer className="form-card-footer">{footer}</footer>}
    </section>
  );
}