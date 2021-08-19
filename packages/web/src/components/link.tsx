import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/react';
import { LinkProps as NextLinkProps } from 'next/link';
import NextLink from 'next/link';
import { ReactNode } from 'react';

export type NextChakraLinkProps = NextLinkProps &
  Omit<ChakraLinkProps, 'as'> & {
    children: ReactNode;
  };

export default function Link({
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  children,
  ...chakraProps
}: NextChakraLinkProps) {
  return (
    <NextLink
      passHref={true}
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
    >
      <ChakraLink {...chakraProps}>{children}</ChakraLink>
    </NextLink>
  );
}
