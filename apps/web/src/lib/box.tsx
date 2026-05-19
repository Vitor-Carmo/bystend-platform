import { forwardRef, type ComponentPropsWithoutRef } from "react";

/**
 * Low-level layout primitive. Renders a native `<div>` and forwards every
 * standard DOM prop. Exists so generated markup can use a single neutral
 * element name (`Box`) without sprinkling raw `<div>`s through pages.
 */
export type BoxProps = ComponentPropsWithoutRef<"div">;

export const Box = forwardRef<HTMLDivElement, BoxProps>(function Box(props, ref) {
  return <div ref={ref} {...props} />;
});
