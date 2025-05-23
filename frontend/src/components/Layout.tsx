import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Theme management is handled by ThemeToggle component and index.html script

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50 dark:bg-secondary-900 transition-colors duration-200">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</div>
      </main>
      <footer className="bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-sm text-secondary-500 dark:text-secondary-400">
          © {new Date().getFullYear()} Patient Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
