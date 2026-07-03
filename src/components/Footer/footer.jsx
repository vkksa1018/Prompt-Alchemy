export default function Footer() {
  return (
    <footer className="w-full py-6 mt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} Prompt-Alchemy. All rights reserved.
    </footer>
  );
}
