import React from 'react';
import clsx from 'clsx';
import LinkItem from '@theme/Footer/LinkItem';
import LayoutStyles from '../../Layout/styles.module.css'; // Import styles from Footer/Layout

function Separator() {
  return <span className={LayoutStyles.footerLinkSeparator}>·</span>; // Using custom separator if needed
}
function SimpleLinkItem({item}) {
  return item.html ? (
    <span
      className={clsx(LayoutStyles.footerLinkItem, item.className)}
      // Developer provided the HTML, so assume it's safe.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: item.html}}
    />
  ) : (
    <li className={LayoutStyles.footerLinkItem}> {/* Wrap in li with custom class */}
      <LinkItem item={item} />
    </li>
  );
}
export default function FooterLinksSimple({links}) {
  return (
    <ul className={LayoutStyles.footerLinkList}> {/* Use custom list class */}
      {links.map((item, i) => (
        <React.Fragment key={i}>
          <SimpleLinkItem item={item} />
          {links.length !== i + 1 && <Separator />}
        </React.Fragment>
      ))}
    </ul>
  );
}
