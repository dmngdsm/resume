import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

function paintContent(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") {
      return child.split(/(\s+)/).map((part, index) =>
        /\S/.test(part) ? <span data-paint-text="" key={index}>{part}</span> : part
      );
    }
    if (isValidElement(child)) {
      const element = child as ReactElement<{ children?: ReactNode }>;
      return element.props.children === undefined
        ? element
        : cloneElement(element, { children: paintContent(element.props.children) });
    }
    return child;
  });
}

export function PaintText({ children }: { children: ReactNode }) {
  return <>{paintContent(children)}</>;
}
