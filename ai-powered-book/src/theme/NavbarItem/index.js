import React from 'react';
import OriginalNavbarItem from '@theme-original/NavbarItem';
import clsx from 'clsx';
import styles from '../Navbar/Content/styles.module.css';

export default function NavbarItem(props) {
  const { className, linkClassName, ...restProps } = props;

  // Combine the custom CSS classes with the original props
  const combinedClassName = clsx(className, styles.navbarItem);
  const combinedLinkClassName = clsx(linkClassName, styles.navbarItemLink);

  return (
    <OriginalNavbarItem
      {...restProps}
      className={combinedClassName}
      linkClassName={combinedLinkClassName}
    />
  );
}