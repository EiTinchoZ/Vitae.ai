import { RootShell, rootMetadata, viewport } from '../root-shell';

export const metadata = rootMetadata('en');
export { viewport };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="en">{children}</RootShell>;
}
