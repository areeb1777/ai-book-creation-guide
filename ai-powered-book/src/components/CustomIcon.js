import React from 'react';
import clsx from 'clsx';
import styles from './CustomIcon.module.css';

const IconMap = {
  'ai': '/img/ai-icon.svg',
  'book': '/img/book-icon.svg',
  'code': '/img/code-icon.svg',
};

function CustomIcon({ type, size = 'medium', className, ...props }) {
  const iconPath = IconMap[type];

  if (!iconPath) {
    console.warn(`Unknown icon type: ${type}`);
    return null;
  }

  const sizeClasses = {
    small: styles.iconSmall,
    medium: styles.iconMedium,
    large: styles.iconLarge,
  };

  return (
    <img
      src={iconPath}
      alt={`${type} icon`}
      className={clsx(
        styles.icon,
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

export default CustomIcon;