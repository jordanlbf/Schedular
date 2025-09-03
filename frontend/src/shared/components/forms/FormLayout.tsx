interface FormCardProps {
  children: React.ReactNode;
  className?: string;
}

export function FormCard({ children, className = "" }: FormCardProps) {
  return (
    <div className={`form-card ${className}`}>
      {children}
    </div>
  );
}

interface FormCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function FormCardHeader({ children, className = "" }: FormCardHeaderProps) {
  return (
    <div className={`form-card-header ${className}`}>
      {children}
    </div>
  );
}

interface FormCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function FormCardBody({ children, className = "" }: FormCardBodyProps) {
  return (
    <div className={`form-card-body ${className}`}>
      {children}
    </div>
  );
}

interface FormGridProps {
  children: React.ReactNode;
  columns?: 2 | 3;
  className?: string;
}

export function FormGrid({ children, columns = 2, className = "" }: FormGridProps) {
  return (
    <div className={`form-grid-${columns} ${className}`}>
      {children}
    </div>
  );
}

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function FormGroup({ children, className = "" }: FormGroupProps) {
  return (
    <div className={`form-group ${className}`}>
      {children}
    </div>
  );
}

interface FormErrorsProps {
  errors: string[];
  title?: string;
}

export function FormErrors({ errors, title = "Please fix the following issues:" }: FormErrorsProps) {
  if (errors.length === 0) return null;

  return (
    <div className="form-errors">
      <h4>{title}</h4>
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
