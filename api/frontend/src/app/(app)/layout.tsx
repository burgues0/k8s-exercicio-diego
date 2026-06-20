import AppLayout from '@/components/layout-components/applayout';

export default function AppSectionLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
