import styles from "./Button.module.css";

/**
 * Button
 * A single button component with two visual variants. Every call-to-action
 * on the landing page — "Get Started," "View on GitHub," the final CTA —
 * renders through this component. Changing how buttons look or behave
 * happens once, here, instead of in five different places.
 *
 * @param {"primary" | "ghost"} variant - visual style
 * @param {"button" | "a"} as - render as a <button> or an <a> tag
 * @param {string} href - required when as="a"
 */
function Button({ variant = "primary", as = "button", href, children, ...rest }) {
  const className = `${styles.button} ${styles[variant]}`;

  if (as === "a") {
    return (
      <a className={className} href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}

export default Button;
