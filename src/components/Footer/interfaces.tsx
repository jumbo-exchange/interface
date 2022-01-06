import { FunctionComponent, SVGProps } from 'react';

export interface ISocialNetwork {
  Image: FunctionComponent<SVGProps<SVGSVGElement>>;
  title: string;
  href: string;
}
