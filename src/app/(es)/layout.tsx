import { RootShell, rootMetadata, viewport } from '../root-shell';

export const metadata = rootMetadata('es');
export { viewport };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="es">{children}</RootShell>;
}
