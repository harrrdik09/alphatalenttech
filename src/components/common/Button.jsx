import styles from './Button.module.css';

export default function Button({
  href,
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  const cls = `${styles.button} ${styles[variant] || ''} ${className}`.trim();

  if (href) {
    return (
      <a className={cls} href={href} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} type={type} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
