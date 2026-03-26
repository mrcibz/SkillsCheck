export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0B1628]/80 py-6">
      <p className="text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} SkillsCheck. All rights reserved.
      </p>
    </footer>
  );
}
