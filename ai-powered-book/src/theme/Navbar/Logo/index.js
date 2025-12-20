import React from 'react';
import Logo from '@theme/Logo';
import styles from './styles.module.css';

export default function NavbarLogo() {
  return (
    <Logo
      className={styles.navbarLogoLink}
      imageClassName={styles.navbarLogoImage}
      titleClassName={styles.navbarLogoTitle}
    />
  );
}