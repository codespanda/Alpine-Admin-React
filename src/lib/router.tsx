'use client';

// Compatibility shim that maps the Next.js navigation API used throughout the
// app onto react-router-dom, so page/component code stays unchanged.

import * as React from 'react';
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams as useRouterParams,
  useSearchParams as useRouterSearchParams,
  type LinkProps as RouterLinkProps,
} from 'react-router-dom';

type LinkProps = Omit<RouterLinkProps, 'to'> & {
  href: string;
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link({ href, ...rest }, ref) {
    return <RouterLink ref={ref} to={href} {...rest} />;
  }
);

export default Link;

export function usePathname(): string {
  return useLocation().pathname;
}

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => navigate(0),
    prefetch: () => {},
  };
}

export const useParams = useRouterParams;

export function useSearchParams(): URLSearchParams {
  const [searchParams] = useRouterSearchParams();
  return searchParams;
}
