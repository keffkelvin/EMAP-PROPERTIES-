export default function Nav() {
  return (
    <nav className="bg-white border-b border-ink/10 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 bg-gold flex items-center justify-center flex-shrink-0"
            style={{ clipPath: "polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0% 50%)" }}
          >
            <span className="font-serif font-semibold text-[13px] text-ink">eP</span>
          </div>
          <span className="font-serif font-semibold text-xl tracking-tight">
            Emap<span className="text-coral">.</span>live
          </span>
        </div>

        <div className="hidden md:flex items-center gap-7">
          <a href="#plots" className="text-sm font-medium text-inkSoft hover:text-ink">Plots</a>
          <a href="#bungalows" className="text-sm font-medium text-inkSoft hover:text-ink">Bungalows</a>
          <a href="#stays" className="text-sm font-medium text-inkSoft hover:text-ink">Stays</a>
          <a href="/portal" className="text-sm font-medium text-inkSoft hover:text-ink">Agent portal</a>
        </div>

        <a
          href="tel:0110000036"
          className="flex items-center gap-2 bg-coral text-white px-4 py-2 rounded-full text-sm font-bold"
        >
          0110 000 036
        </a>
      </div>
    </nav>
  );
}
